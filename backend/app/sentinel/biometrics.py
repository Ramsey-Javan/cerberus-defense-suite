
def analyze_biometrics(bio: dict) -> dict:
    """
    Returns biometric risk flags.
    """
    flags = {
        "username_pasted": bio.get("username_pasted", False),
        "password_pasted": bio.get("password_pasted", False),
        "username_speed_low": bio.get("username_duration_ms", 0) > 5000,  # >5s → bot?
        "password_speed_high": bio.get("password_duration_ms", 0) < 200,  # <200ms → paste/autofill
    }

    risk_score = 0
    if flags["username_pasted"]: risk_score += 30
    if flags["password_pasted"]: risk_score += 50
    if flags["password_speed_high"]: risk_score += 20

    return {
        "flags": flags,
        "biometric_risk": risk_score,
        "biometric_verdict": "high" if risk_score >= 50 else "medium" if risk_score >= 20 else "low"
    }