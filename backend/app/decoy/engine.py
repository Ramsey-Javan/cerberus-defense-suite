class DecoyEngine: 
    def spawn_decoy(self, attacker_ip: str): 
        """
        MVP - simulate decoy creation
        """
        return {
            "decoy_url": "http://decoy.local/portal",
            "status ": "spawned",
            "attacker": attacker_ip
        } 
