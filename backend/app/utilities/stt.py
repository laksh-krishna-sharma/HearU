from typing import Optional
from google import genai
from google.genai import types
from config import settings


class SpeechToText:
    def __init__(self) -> None:
        self.client = genai.Client(api_key=settings.gemini_api_key)

    def transcribe_from_bytes(
        self,
        audio_bytes: bytes,
        mime_type: str = "audio/mp3",
        prompt: Optional[str] = None,
    ) -> str:
        """Transcribe audio from raw bytes."""
        contents = []
        if prompt:
            contents.append(prompt)

        contents.append(
            types.Part.from_bytes(
                data=audio_bytes,
                mime_type=mime_type,
            )
        )

        response = self.client.models.generate_content(
            model=settings.stt_model,
            contents=contents,
        )

        return response.text

    def transcribe_from_file(
        self, file_path: str, prompt: str = "Generate a transcript of the speech."
    ) -> str:
        """Transcribe audio directly from a file upload."""
        myfile = self.client.files.upload(file=file_path)

        response = self.client.models.generate_content(
            model=settings.stt_model,
            contents=[prompt, myfile],
        )
        return response.text
