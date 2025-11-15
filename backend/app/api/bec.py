from fastapi import APIRouter
from app.ml.tone_model import ToneModel

router = APIRouter()
model = ToneModel()

@router.post("/scan")
def scan_email(email: dict):
    text = email.get("text", "")
    result = model.detect_bec(text)
    return result
