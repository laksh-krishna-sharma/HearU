from typing import List
from google import genai
import os

from models.eve import EveSession


class GeminiService:
    """
    Abstraction layer around Google Gemini for different Eve tasks.
    """

    def __init__(self, api_key: str | None = None):
        self.client = genai.Client(api_key=api_key or os.getenv("GEMINI_API_KEY"))

    # ---------- One-shot reply (Journal) ----------
    def generate_reply(self, context: str) -> str:
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"You are Eve, a supportive therapist-like companion. {context}",
        )
        return response.text.strip()

    # ---------- Conversation with rolling context ----------
    def chat_with_context(self, session: EveSession, user_text: str) -> str:
        # Collect history (user + eve messages)
        history: List[str] = []
        for m in session.messages:
            prefix = "User" if m.role == "user" else "Eve"
            history.append(f"{prefix}: {m.text}")

        conversation = "\n".join(history) + f"\nUser: {user_text}"

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"System prompt: {session.system_prompt}\n{conversation}\nEve:",
        )
        return response.text.strip()

    # ---------- Summarization ----------
    def summarize(self, history: str) -> str:
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Summarize the following therapy-like conversation into clear notes:\n\n{history}",
        )
        return response.text.strip()
