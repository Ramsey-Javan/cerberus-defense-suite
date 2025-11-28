from datetime import datetime
from zoneinfo import ZoneInfo

# Mock user profile DB (replace with real AD/DB later)
USER_PROFILES = {
    "admin": {
        "usual_ips": ["192.168.1.10", "203.91.45.112"],
        "usual_hours": (7, 18),  # 7 AM – 6 PM EAT
        "timezone": "Africa/Nairobi"
    }
}

def analyze_context(username: str, client_ip: str, login_time_iso: str) -> dict:
    profile = USER_PROFILES.get(username, {})
    now = datetime.fromisoformat(login_time_iso.replace("Z", "+00:00"))
    
    # Convert to user's timezone
    tz = ZoneInfo(profile.get("timezone", "UTC"))
    local_time = now.astimezone(tz)
    hour = local_time.hour

    # Rules
    new_ip = client_ip not in profile.get("usual_ips", [])
    unusual_time = not (profile.get("usual_hours", (0,24))[0] <= hour <= profile.get("usual_hours", (0,24))[1])

    risk_score = 0
    if new_ip: risk_score += 25
    if unusual_time: risk_score += 25

    return {
        "new_ip": new_ip,
        "unusual_time": unusual_time,
        "context_risk": risk_score,
        "context_verdict": "high" if risk_score >= 50 else "medium" if risk_score >= 25 else "low"
    }