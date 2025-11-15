from fastapi import APIRouter 
from app.decoy.engine import DecoyEngine

router =APIRouter()
decoy_engine = DecoyEngine()

@router.post("/clicked")
def phishing_clicked(attacker_ip: str):
    result = decoy_engine.spawn_decoy(attacker_ip)
    return {"message": "Decoy deployed", "data": result}