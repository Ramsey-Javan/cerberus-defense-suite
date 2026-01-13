from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
import asyncio
#from sqlalchemy.orm import Session
#from app.db.session import get_db  # We'll add this later

router = APIRouter(tags=["Alerts"])

# ===== HTTP ENDPOINTS (for polling) =====
@router.get("/alerts")
def get_alerts():
    """Mock data for now - will connect to DB later"""
    return [
        {
            "id": "alert_001",
            "type": "PHISHING_LOGIN",
            "ip_address": "41.89.123.45",
            "timestamp": "2026-01-13T01:23:45Z",
            "severity": "high"
        },
        {
            "id": "alert_002",
            "type": "BEC_DETECTION",
            "ip_address": "196.201.10.5",
            "timestamp": "2026-01-13T01:20:15Z",
            "severity": "critical"
        }
    ]

@router.get("/sessions")
def get_sessions():
    return [
        {
            "session_id": "sess_001",
            "ip_address": "41.89.123.45",
            "credentials_captured": True,
            "documents_downloaded": 2,
            "is_active": True
        }
    ]

@router.get("/risk-summary")
def get_risk_summary():
    return {
        "low": 12,
        "medium": 5,
        "high": 3,
        "critical": 1
    }

# ===== WEBSOCKET CONNECTION MANAGER =====
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket):
        self.active_connections[user_id].remove(websocket)
        if not self.active_connections[user_id]:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)

manager = ConnectionManager()

# ===== WEBSOCKET ENDPOINT =====
@router.websocket("/ws/alerts/{user_id}")
async def websocket_alerts(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Keep connection alive
            await asyncio.sleep(30)
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)

# ===== FUNCTION TO PUSH ALERTS (call this when new alert is created) =====
async def broadcast_alert(alert_data: dict, user_id: str = "admin"):
    """Call this from your phishing/BEC endpoints when new alert is generated"""
    await manager.send_personal_message(alert_data, user_id)