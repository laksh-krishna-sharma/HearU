from __future__ import annotations
import abc
import os
import uuid
import tempfile
import dataclasses
import typing
import asyncio
import base64
from typing import Optional, Dict, Any, Callable

# Import config settings (assumes you have app/config.py exposing `settings`)
from config import settings

# genai client for Gemini TTS
try:
    from google import genai
    from google.genai import types as genai_types
    _HAS_GENAI = True
except Exception:
    genai = None  # type: ignore
    genai_types = None  # type: ignore
    _HAS_GENAI = False

import wave


@dataclasses.dataclass
class TTSResult:
    gcs_path: Optional[str]
    signed_url: Optional[str]
    duration_seconds: Optional[float]
    audio_format: str
    voice: str
    tts_meta: Dict[str, Any] = dataclasses.field(default_factory=dict)


class ITTSAdapter(abc.ABC):
    @abc.abstractmethod
    async def synthesize_to_gcs(
        self,
        text: str,
        *,
        voice: str = "Kore",
        language: str = "en-IN",
        bucket: Optional[str] = None,
        filename_prefix: Optional[str] = None,
        gcs_uploader: Optional[Callable[[str, str], str]] = None,
    ) -> TTSResult:
        raise NotImplementedError


# helper to write PCM bytes into a WAV file using wave module
def wave_file(filename: str, pcm_bytes: bytes, channels: int = 1, rate: int = 24000, sample_width: int = 2) -> None:
    """
    Write raw PCM bytes to a WAV container.
    Note: the 'pcm_bytes' should be raw PCM (little-endian) matching sample_width and rate.
    """
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_bytes)


class MockTTSAdapter(ITTSAdapter):
    async def synthesize_to_gcs(
        self,
        text: str,
        *,
        voice: str = "MockVoice",
        language: str = "en-IN",
        bucket: Optional[str] = None,
        filename_prefix: Optional[str] = None,
        gcs_uploader: Optional[Callable[[str, str], str]] = None,
    ) -> TTSResult:
        fname = (filename_prefix or "eve") + "-" + uuid.uuid4().hex[:8] + ".txt"
        local_path = os.path.join(tempfile.gettempdir(), fname)
        with open(local_path, "wb") as f:
            f.write(b"MOCK_TTS\n")
            f.write(text.encode("utf-8")[:16000])

        gcs_path = local_path
        signed_url = f"file://{local_path}"
        if gcs_uploader:
            try:
                # run uploader in threadpool if sync
                gcs_path = await asyncio.get_event_loop().run_in_executor(None, lambda: gcs_uploader(local_path, fname))
                # uploader may also generate signed url; we leave signed_url None unless uploader returns something recognizable
                signed_url = None
            except Exception:
                signed_url = f"file://{local_path}"

        return TTSResult(
            gcs_path=gcs_path,
            signed_url=signed_url,
            duration_seconds=None,
            audio_format="txt",
            voice=voice,
            tts_meta={"mock": True},
        )


class GeminiTTSAdapter(ITTSAdapter):
    """
    Adapter for Gemini TTS using google.genai (Gemini TTS preview).
    Requires `google-genai` installed and settings.GEMINI_API_KEY to be set.
    The adapter runs blocking genai calls inside asyncio.to_thread to keep async compat.
    """

    def __init__(self, *, model: str = "gemini-2.5-flash-preview-tts", sample_rate: int = 24000, sample_width: int = 2):
        if not _HAS_GENAI:
            raise RuntimeError("google-genai is required for GeminiTTSAdapter (install google-genai).")
        if not getattr(settings, "GEMINI_API_KEY", None):
            raise RuntimeError("settings.GEMINI_API_KEY must be set to use GeminiTTSAdapter.")
        self._model = model
        self._sample_rate = sample_rate
        self._sample_width = sample_width
        # instantiate client lazily (in thread) to avoid import-time side-effects
        self._client = None

    def _init_client_sync(self):
        # create client using the key from settings
        client = genai.Client(api_key=getattr(settings, "GEMINI_API_KEY"))
        return client

    async def synthesize_to_gcs(
        self,
        text: str,
        *,
        voice: str = "Kore",
        language: str = "en-IN",
        bucket: Optional[str] = None,
        filename_prefix: Optional[str] = None,
        gcs_uploader: Optional[Callable[[str, str], str]] = None,
    ) -> TTSResult:
        """
        Perform TTS by calling Gemini TTS model, write WAV locally, and optionally upload via gcs_uploader.
        Returns TTSResult with gcs_path (or local path) and optional signed_url (if uploader provides).
        """

        # ensure client initialized (synchronous) in a thread
        if self._client is None:
            self._client = await asyncio.to_thread(self._init_client_sync)

        # run genai.generate_content in thread to avoid blocking event loop
        def _call_genai() -> Dict[str, Any]:
            # Build the request config similar to your sample
            response = self._client.models.generate_content(
                model=self._model,
                contents=f"Say: {text}",
                config=genai_types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=genai_types.SpeechConfig(
                        voice_config=genai_types.VoiceConfig(
                            prebuilt_voice_config=genai_types.PrebuiltVoiceConfig(
                                voice_name=voice,
                            )
                        ),
                        # Optional: additional speech config fields can be added here
                    ),
                ),
            )
            return {"response": response}

        genai_result = await asyncio.to_thread(_call_genai)

        response = genai_result["response"]
        # navigate the response to find inline audio bytes (best-effort similar to sample)
        try:
            candidate = response.candidates[0]
            parts = candidate.content.parts
            # find first part that has inline_data
            inline_bytes = None
            for p in parts:
                if hasattr(p, "inline_data") and getattr(p.inline_data, "data", None):
                    inline_bytes = p.inline_data.data  # could be bytes or base64 str
                    break
            if inline_bytes is None:
                raise ValueError("No inline audio data in Gemini response")
        except Exception as exc:
            raise RuntimeError(f"Failed to parse Gemini response: {exc}")

        # inline_bytes may be bytes or base64 string; normalize to raw bytes
        if isinstance(inline_bytes, (bytes, bytearray)):
            pcm_bytes = bytes(inline_bytes)
        elif isinstance(inline_bytes, str):
            # attempt base64 decode
            try:
                pcm_bytes = base64.b64decode(inline_bytes)
            except Exception:
                # fallback: encode string directly (not ideal)
                pcm_bytes = inline_bytes.encode("utf-8")
        else:
            pcm_bytes = bytes(inline_bytes)

        # write to temp wav file
        suffix = ".wav"
        fname = (filename_prefix or "eve") + "-" + uuid.uuid4().hex[:8] + suffix
        local_path = os.path.join(tempfile.gettempdir(), fname)

        try:
            wave_file(local_path, pcm_bytes, channels=1, rate=self._sample_rate, sample_width=self._sample_width)
        except Exception as exc:
            # As a fallback, just write raw bytes to file
            with open(local_path, "wb") as wf:
                wf.write(pcm_bytes)

        object_name = fname
        gcs_path = None
        signed_url = None

        if gcs_uploader:
            # call uploader in threadpool (uploader is likely sync)
            def _upload():
                return gcs_uploader(local_path, object_name)

            try:
                gcs_path_or_url = await asyncio.to_thread(_upload)
                # Accept either a gs:// path or a signed URL or object name
                # If uploader returns signed URL string, set signed_url; else set gcs_path
                if isinstance(gcs_path_or_url, str) and gcs_path_or_url.startswith("http"):
                    signed_url = gcs_path_or_url
                    gcs_path = None
                else:
                    gcs_path = gcs_path_or_url
            except Exception as exc:
                # upload failed -> return local path and include error metadata
                gcs_path = local_path
                signed_url = None
                meta_error = {"upload_error": str(exc)}
        else:
            gcs_path = local_path
            signed_url = None
            meta_error = {}

        tts_meta = {"model": self._model, "voice": voice}
        if 'meta_error' in locals():
            tts_meta.update(meta_error)

        return TTSResult(
            gcs_path=gcs_path,
            signed_url=signed_url,
            duration_seconds=None,
            audio_format="wav",
            voice=voice,
            tts_meta=tts_meta,
        )
