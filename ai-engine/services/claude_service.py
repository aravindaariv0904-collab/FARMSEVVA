import anthropic
from core.config import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class ClaudeService:
    def __init__(self) -> None:
        self.client: Optional[anthropic.Anthropic] = None
        if not settings.CLAUDE_API_KEY:
            logger.warning("CLAUDE_API_KEY not set. Using mock responses.")
        else:
            self.client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)

    async def generate_response(self, query: str, context: Optional[dict] = None) -> str:
        client = self.client
        if client is None:
            return "This is a mock response from Terra AI (Claude API disabled/missing key)."

        try:
            prompt = "You are Terra AI, an agricultural assistant for Farm Seeva."
            if context:
                prompt += f"\nContext: {context}"
                
            response = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1000,
                system=prompt,
                messages=[
                    {"role": "user", "content": query}
                ]
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Error calling Claude API: {e}")
            raise Exception("Failed to fetch AI response")

