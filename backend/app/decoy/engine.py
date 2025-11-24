import uuid
import time
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from threading import Lock

# Local storage module
from .storage import get_db, init_db


@dataclass
class DecoySession:
    session_id: str
    created_at: float
    expires_at: Optional[float] = None
    status: str = "active"  # active, expired, terminated, captured
    metadata: Dict[str, Any] = None
    attacker_ip: Optional[str] = None
    attacker_user_agent: Optional[str] = None
    captured_credentials: Optional[Dict[str, str]] = None
    decoy_container_id: Optional[str] = None
    visited_pages: List[str] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
        if self.visited_pages is None:
            self.visited_pages = []

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["created_at_iso"] = datetime.fromtimestamp(self.created_at, tz=timezone.utc).isoformat()
        if self.expires_at:
            d["expires_at_iso"] = datetime.fromtimestamp(self.expires_at, tz=timezone.utc).isoformat()
        return d


class DecoyEngine:
    """
    DecoyEngine manages lifecycles of dynamic, ephemeral decoy environments.
    Each session is tied to a phishing link and may spawn a decoy container.
    Supports tracking, expiry, cleanup, and telemetry extraction.
    """

    def __init__(self, session_ttl: int = 3600):  # 1hr default TTL
        self._lock = Lock()  # thread-safety for concurrent requests
        self.session_ttl = session_ttl
        init_db()  # Ensure DB tables exist

    # --- Helper serialization methods ---
    def _serialize_dict(self, d: Optional[Dict]) -> str:
        return json.dumps(d) if d is not None else "null"

    def _deserialize_dict(self, s: str) -> Optional[Dict]:
        return json.loads(s) if s and s != "null" else None

    def _deserialize_list(self, s: str) -> List[str]:
        return json.loads(s) if s and s != "null" else []

    # --- Core session methods (DB-backed) ---
    def create_decoy_session(
        self,
        metadata: Optional[Dict[str, Any]] = None,
        attacker_ip: Optional[str] = None,
        attacker_user_agent: Optional[str] = None,
        ttl: Optional[int] = None
    ) -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        now = time.time()
        expiry = now + (ttl or self.session_ttl)
        created_at_iso = datetime.fromtimestamp(now, tz=timezone.utc).isoformat()

        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO decoy_sessions 
                (session_id, created_at, expires_at, status, metadata, attacker_ip,
                 attacker_user_agent, captured_credentials, decoy_container_id, visited_pages, created_at_iso)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                session_id,
                now,
                expiry,
                "active",
                self._serialize_dict(metadata or {}),
                attacker_ip,
                attacker_user_agent,
                "null",
                None,
                self._serialize_dict([]),
                created_at_iso
            ))
            conn.commit()

        return {
            "session_id": session_id,
            "created_at": now,
            "expires_at": expiry,
            "status": "active",
            "metadata": metadata or {},
            "attacker_ip": attacker_ip,
            "attacker_user_agent": attacker_user_agent,
            "captured_credentials": None,
            "decoy_container_id": None,
            "visited_pages": [],
            "created_at_iso": created_at_iso,
        }

    def get_decoy_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM decoy_sessions WHERE session_id = ?", (session_id,))
            row = cur.fetchone()
            if not row:
                return None

            # Auto-expire check
            now = time.time()
            expires_at = row["expires_at"]
            status = row["status"]
            if expires_at and now > expires_at and status == "active":
                cur.execute("UPDATE decoy_sessions SET status = ? WHERE session_id = ?", ("expired", session_id))
                conn.commit()
                status = "expired"

            return {
                "session_id": row["session_id"],
                "created_at": row["created_at"],
                "expires_at": row["expires_at"],
                "status": status,
                "metadata": self._deserialize_dict(row["metadata"]),
                "attacker_ip": row["attacker_ip"],
                "attacker_user_agent": row["attacker_user_agent"],
                "captured_credentials": self._deserialize_dict(row["captured_credentials"]),
                "decoy_container_id": row["decoy_container_id"],
                "visited_pages": self._deserialize_list(row["visited_pages"]),
                "created_at_iso": row["created_at_iso"],
            }

    def list_active_sessions(self) -> List[Dict[str, Any]]:
        """Return only non-expired, active sessions."""
        now = time.time()
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("""
                SELECT * FROM decoy_sessions 
                WHERE status = 'active' AND (expires_at IS NULL OR expires_at > ?)
            """, (now,))
            rows = cur.fetchall()
        return [self._row_to_dict(row) for row in rows]

    def _row_to_dict(self, row) -> Dict[str, Any]:
        return {
            "session_id": row["session_id"],
            "created_at": row["created_at"],
            "expires_at": row["expires_at"],
            "status": row["status"],
            "metadata": self._deserialize_dict(row["metadata"]),
            "attacker_ip": row["attacker_ip"],
            "attacker_user_agent": row["attacker_user_agent"],
            "captured_credentials": self._deserialize_dict(row["captured_credentials"]),
            "decoy_container_id": row["decoy_container_id"],
            "visited_pages": self._deserialize_list(row["visited_pages"]),
            "created_at_iso": row["created_at_iso"],
        }

    def record_credential_capture(
        self,
        session_id: str,
        username: str,
        password: str,
        page: str = "/login"
    ) -> bool:
        captured_data = {
            "username": username,
            "password": password,  # fake!
            "captured_at": time.time(),
            "page": page
        }
        with get_db() as conn:
            cur = conn.cursor()
            # Update credentials and append page to visited_pages (deduped)
            cur.execute("""
                UPDATE decoy_sessions 
                SET captured_credentials = ?, 
                    visited_pages = json_insert(visited_pages, '$[#]', ?)
                WHERE session_id = ? AND status = 'active'
                AND json_extract(visited_pages, '$') NOT LIKE ?
            """, (
                self._serialize_dict(captured_data),
                page,
                session_id,
                f'%"{page}"%'
            ))
            conn.commit()
            return cur.rowcount > 0

    def record_page_visit(self, session_id: str, page: str) -> bool:
        """Log a page visit (append if not already visited)."""
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("""
                UPDATE decoy_sessions 
                SET visited_pages = 
                    CASE 
                        WHEN json_extract(visited_pages, '$') LIKE ? THEN visited_pages
                        ELSE json_insert(visited_pages, '$[#]', ?)
                    END
                WHERE session_id = ? AND status = 'active'
            """, (f'%"{page}"%', page, session_id))
            conn.commit()
            return cur.rowcount > 0

    def terminate_session(self, session_id: str, reason: str = "manual") -> bool:
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("""
                UPDATE decoy_sessions 
                SET status = ?, metadata = json_patch(metadata, ?)
                WHERE session_id = ? AND status = 'active'
            """, (
                "terminated",
                self._serialize_dict({"termination_reason": reason, "terminated_at": time.time()}),
                session_id
            ))
            conn.commit()
            return cur.rowcount > 0

    def trigger_user_alert(self, session_id: str, real_user: str = "demo@user.gov.ke") -> bool:
        """Store alert in DB for frontend polling."""
        msg = (
            "⚠️ You clicked a phishing link. No real data was exposed.\n"
            f"Session ID: {session_id[:8]}\n"
            "Fake credentials were captured. Please complete 5-minute security training."
        )
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO alerts (user_id, session_id, message, created_at)
                VALUES (?, ?, ?, ?)
            """, (real_user, session_id, msg, time.time()))
            conn.commit()
            return True

    # --- Utility function (standalone, not part of class instance methods) ---
    @staticmethod
    def generate_watermark(session: Dict[str, Any], doc: Dict[str, Any]) -> str:
        """Generate dynamic watermark text for fake documents."""
        now = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
        template = doc.get("watermark_template", "CERBERUS-{{session_id}}")
        # Safely slice strings to avoid IndexError
        session_id_short = session.get("session_id", "")[:8] or "unknown"
        ip_short = (session.get("attacker_ip") or "anon")[:15]
        username = (session.get("captured_credentials", {}).get("username") or "anon")[:10]

        wm = (
            template
            .replace("{{session_id}}", session_id_short)
            .replace("{{attacker_ip}}", ip_short)
            .replace("{{username}}", username)
            .replace("{{timestamp}}", now)
        )
        return wm