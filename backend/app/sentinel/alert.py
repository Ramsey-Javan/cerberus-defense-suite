import time
from app.database import get_db

try:
    from app.api.alerts import router
        WEBSOCKET_ENABLED = True
except ImportError:
    WEBSOCKET_ENABLED = False

def trigger_user_alert(session_id: str, real_user_email: str = "demo@user.gov.ke"):
    msg = "⚠️ You clicked a phishing link. No real data was exposed. Please complete 5-minute security training."
    
    # 1. Save to DB (existing)
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO alerts (user_id, session_id, message, created_at)
            VALUES (?, ?, ?, ?)
        """, (real_user_email, session_id, msg, time.time()))
        conn.commit()

    # 2. Emit via WebSocket (NEW)
    if WEBSOCKET_ENABLED:
        alert_data = {
            "type": "phishing_click",
            "session_id": session_id,
            "message": msg,
            "timestamp": time.time()
        }
        # Use asyncio to send (safe in FastAPI async context)
        import asyncio
        try:
            asyncio.create_task(manager.send_personal_message(alert_data, real_user_email))
        except RuntimeError:
            # If no event loop (e.g., CLI test), skip WS
            pass