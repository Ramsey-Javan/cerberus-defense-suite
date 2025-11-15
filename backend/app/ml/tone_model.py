class ToneModel:
    def detect_bac(self, text: str):
        """
        Simple keyword detection for MVP
        """

        suspicious_words = ["urgent", "wire", "transfer", "immediately", "Confidential", "ASAP"]
        score = sum(w in text.lower() for w in suspicious_words)
        return {"tone_score": score }