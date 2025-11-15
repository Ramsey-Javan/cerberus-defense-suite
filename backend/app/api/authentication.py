from fastapi import APIRouter
from app.ml.behavior_model import BehaviorModel

router = APIRouter()
model = BehaviorModel()

@router.post("/login")
def login_event(event: dict):
    analysis = model.analyze(event)
    return analysis
