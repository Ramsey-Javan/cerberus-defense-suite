# backend/app/api/phishing.py
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
import json
from app.decoy.engine import DecoyEngine

router = APIRouter(prefix="/phishing", tags=["Phishing Decoy"])
engine = DecoyEngine()

# Templates
templates = Jinja2Templates(directory=Path(__file__).parent.parent / "decoy" / "templates")

# Load fake docs
with open(Path(__file__).parent.parent / "decoy" / "fake_docs.json") as f:
    FAKE_DOCS = json.load(f)


@router.post("/click")
async def phishing_click(request: Request):
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "")

    session = engine.create_decoy_session(
        metadata={"source": "email_campaign_alpha"},
        attacker_ip=client_ip,
        attacker_user_agent=user_agent,
        ttl=3600
    )

    # Trigger user alert (demo: assume victim is demo@user.gov.ke)
    engine.trigger_user_alert(session["session_id"])

    return {
        "redirect_url": f"/decoy/{session['session_id']}/login",  
        "session_id": session["session_id"]
    }


@router.post("/capture")
async def capture_credentials(payload: dict):
    required = {"session_id", "username", "password"}
    if not all(k in payload for k in required):
        raise HTTPException(400, "Missing fields: session_id, username, password")

    success = engine.record_credential_capture(
        session_id=payload["session_id"],
        username=payload["username"],
        password=payload["password"],
        page=payload.get("page", "/login")
    )
    if not success:
        raise HTTPException(404, "Session not found or expired")

    return {"success": True, "message": "Fake credentials captured"}


@router.post("/visit")
async def record_visit(payload: dict):
    if "session_id" not in payload or "page" not in payload:
        raise HTTPException(400, "session_id and page required")

    success = engine.record_page_visit(
        session_id=payload["session_id"],
        page=payload["page"]
    )
    return {"success": success}

# --- HTML Serving Endpoints ---
@router.get("/{session_id}/login", response_class=HTMLResponse)
async def fake_login_page(request: Request, session_id: str):
    session = engine.get_decoy_session(session_id)
    if not session or session["status"] != "active":
        raise HTTPException(404, "Session expired or invalid")
    return templates.TemplateResponse(
        "fake_login.html", {"request": request, "session_id": session_id}
    )


@router.get("/{session_id}/portal", response_class=HTMLResponse)
async def fake_portal_page(request: Request, session_id: str):
    session = engine.get_decoy_session(session_id)
    if not session or session["status"] != "active":
        raise HTTPException(404, "Session expired")

    username = session.get("captured_credentials", {}).get("username", "Staff")  
    return templates.TemplateResponse(
        "fake_portal.html",
        {
            "request": request,
            "session_id": session_id,
            "username": username,
            "documents": FAKE_DOCS  
        }
    )