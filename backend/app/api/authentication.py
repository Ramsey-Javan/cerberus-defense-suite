# backend/app/api/authentication.py
from fastapi import APIRouter, HTTPException
from ..sentinel.biometrics import analyze_biometrics
from ..sentinel.anomaly import analyze_context
from ..decoy.engine import DecoyEngine

router = APIRouter(prefix="/auth", tags=["Credential Sentinel"])

engine = DecoyEngine()

@router.post("/login")
async def credential_login(payload: dict):
    username = payload.get("username")
    password = payload.get("password")
    biometrics = payload.get("biometrics", {})
    client_ip = payload.get("client_ip", "unknown")
    login_time = payload.get("login_time", "")

    if not username or not password:
        raise HTTPException(400, "Username and password required")

    # ✅ Step 1: Biometric analysis
    bio_result = analyze_biometrics(biometrics)

    # ✅ Step 2: Contextual analysis
    context_result = analyze_context(username, client_ip, login_time)

    # ✅ Step 3: Combine risk
    total_risk = bio_result["biometric_risk"] + context_result["context_risk"]
    
    if total_risk >= 70:
        verdict = "high"
        action = "trap"  # Send to decoy!
        # Create decoy session for attacker
        decoy = engine.create_decoy_session(
            metadata={"source": "credential_sentinel_trap", "real_user": username},
            attacker_ip=client_ip,
            attacker_user_agent=payload.get("user_agent", "")
        )
        session_id = decoy["session_id"]
        engine.trigger_user_alert(session_id, real_user=username)
        message = "Suspicious login detected. Redirecting to secure verification..."
    elif total_risk >= 30:
        verdict = "medium"
        action = "flag"
        session_id = None
        message = "Unusual activity detected. Security team notified."
    else:
        verdict = "low"
        action = "allow"
        session_id = None
        message = "Login successful."

    return {
        "username": username,
        "verdict": verdict,
        "risk_score": total_risk,
        "biometric_analysis": bio_result,
        "context_analysis": context_result,
        "action": action,
        "session_id": session_id,
        "message": message
    }