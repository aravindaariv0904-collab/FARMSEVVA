from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from services.claude_service import ClaudeService
from services.crop_engine import CropRecommendationEngine
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    query: str
    context: dict | None = None

class CropRequest(BaseModel):
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float

@router.post("/chat")
async def chat_with_terra(request: ChatRequest):
    try:
        service = ClaudeService()
        response = await service.generate_response(request.query, request.context)
        return {"response": response}
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="AI Service Error")

@router.post("/recommend-crops")
async def recommend_crops(request: CropRequest):
    try:
        engine = CropRecommendationEngine()
        recommendations = engine.get_recommendations(
            request.ph, request.nitrogen, request.phosphorus, request.potassium
        )
        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Crop engine error: {str(e)}")
        raise HTTPException(status_code=500, detail="Crop recommendation failed")
