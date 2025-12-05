import time
from app.database import get_db

def triger_user_alert(session_id: str, real_user_email: str = "demo@user.gov.ke"):
    # In real system: derive real_user from fishing token 
    # For MVP: assume demo user 
    msg = " You clicked a phising link. No real data was exposed, Please complete  a 5 minutes training."
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO user_alerts (user_id, session_id, message, created_at)
            VALUES (?, ?, ?, ?)
        """, (
            real_user_email,session_id,msg,time.time()
        ))
        conn.commit()

