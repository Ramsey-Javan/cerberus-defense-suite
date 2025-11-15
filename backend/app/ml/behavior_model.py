class BehaviorModel:
    def analyze(self, login_event: dict):
        """
        Dummy behavioral model for MVP
        """
        return {"risk_score": 0.3, "status": "normal" }