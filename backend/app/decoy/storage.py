
import sqlite3
import json 
from pathlib import Path
from contextlib import contextmanager
from typing import Optional, Dict, Any, List 

# Ensure data dir exist 
DATA_DIR = Path(__file__).parent.parent.parent / "data"
DB_PATH = Path(__file__).parent.parent.parent / "data" / "decoy_sessions.db"
def init_db():
    DB_PATH.parent.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Main decoy sessions table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS decoy_sessions (
            session_id TEXT PRIMARY KEY,
            created_at REAL NOT NULL,
            expires_at REAL,
            status TEXT DEFAULT 'active',
            metadata TEXT,
            attacker_ip TEXT,
            attacker_user_agent TEXT,
            captured_credentials TEXT,
            decoy_container_id TEXT,
            visited_pages TEXT,
            created_at_iso TEXT
        )
    """)

    # Alerts table (for user notifications)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            alert_type TEXT DEFAULT 'phishing_click',
            message TEXT NOT NULL,
            created_at REAL NOT NULL,
            is_read BOOLEAN DEFAULT 0
        )
    """)
    
    conn.commit()
    conn.close()


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def serialize_json(data: Optional[Dict] )-> str:
    return json.dumps(data) if data else "null"

def deserialize_json(s: str) -> Optional[Dict]:
    return json.loads(s) if s and s != "null" else None

def deserialize_list(s: str) -> List[str]:
    return json.loads(s) if s and s != "null" else []