import json
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo  

# Load profiles from JSON
DATA_DIR = Path(__file__).parent.parent.parent / "data"
USER_PROFILES = {}
try:
    with open(DATA_DIR / "user_profiles.json") as f:
        USER_PROFILES = json.load(f)
except Exception as e:
    print(f"⚠️ Warning: Could not load user_profiles.json: {e}")
    USER_PROFILES = {}

# Minimal mock user profiles (for demo — replace with DB later)
USER_PROFILES = {
    "admin": {
        "trusted_ips": ["192.168.1.10", "203.91.45.112"],
        "trusted_hours": (7, 18),  # 7 AM – 6 PM EAT
        "timezone": "Africa/Nairobi"
    },
    "finance_officer": {
        "trusted_ips": ["10.0.0.5"],
        "trusted_hours": (8, 17),
        "timezone": "Africa/Nairobi"
    }
}

def analyze_context(username: str, client_ip: str, login_time_iso: str) -> dict:
    profile = USER_PROFILES.get(username, {})
    now = datetime.fromisoformat(login_time_iso.replace("Z", "+00:00"))

    # Convert to user's local time
    tz_str = profile.get("timezone", "UTC")
    local_time = now.astimezone(ZoneInfo(tz_str))
    hour = local_time.hour

    # Rules
    new_ip = client_ip not in profile.get("trusted_ips", [])
    unusual_time = not (
        profile.get("trusted_hours", (0, 24))[0] 
        <= hour 
        <= profile.get("trusted_hours", (24, 24))[1]
    )

    risk = 0
    if new_ip: risk += 25
    if unusual_time: risk += 25

    return {
        "flags": {
            "new_ip": new_ip,
            "unusual_time": unusual_time
        },
        "context_risk": risk,
        "verdict": "high" if risk >= 50 else "medium" if risk >= 25 else "low"
    }

