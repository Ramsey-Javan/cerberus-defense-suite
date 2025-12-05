def analyze_biometrics(bio: dict) -> dict:
    """
    Analyzes biometric signals from frontend.
    Input: {
        "username_duration_ms": 1200,
        "password_duration_ms": 80,
        "username_len": 6,
        "password_len": 10,
        "password_pasted": true   # optional — computed frontend or here
    }
    """
    # Compute paste heuristic if not provided
    password_pasted = bio.get("password_pasted")
    if password_pasted is None:
        duration = bio.get("password_duration_ms", 0)
        length = bio.get("password_len", 1)
        # < 50ms/char → likely paste/autofill
        password_pasted = duration > 0 and (duration / length) < 50

    username_pasted = bio.get("username_pasted", False)

    # Risk scoring
    risk = 0
    if password_pasted:
        risk += 50  # High: credential stuffing
    if username_pasted:
        risk += 30

    return {
        "flags": {
            "password_pasted": password_pasted,
            "username_pasted": username_pasted
        },
        "biometric_risk": risk,
        "verdict": "high" if risk >= 50 else "medium" if risk >= 30 else "low"
    }

