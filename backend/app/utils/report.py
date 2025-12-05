from pathlib import Path
from weasyprint import HTML
import json

def generate_attacker_report(session: dict, output_path: str = None) -> str:
    """Generates PDF report from decoy session."""
    if output_path is None:
        output_path = f"data/reports/report_{session['session_id'][:8]}.pdf"
    
    Path(output_path).parent.mkdir(exist_ok=True)
    
    # Sanitize fake creds (never show full fake password in demo!)
    creds = session.get("captured_credentials") or {}
    password = creds.get("password", "") if isinstance(creds, dict) else ""
    redacted_pass = ("*" * len(password))[:8] + ("..." if len(password) > 8 else "")

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Cerberus Attacker Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ text-align: center; border-bottom: 3px solid #1640f1; padding-bottom: 20px; }}
            .header h1 {{ color: #1640f1; margin: 0; }}
            .section {{ margin: 20px 0; }}
            .label {{ font-weight: bold; color: #333; }}
            table {{ width: 100%; border-collapse: collapse; margin: 10px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            .watermark {{ color: #888; font-size: 0.8em; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🛡️ CERBERUS DEFENSE SUITE</h1>
            <p><em>Intelligence Report — Generated {session.get('created_at_iso', 'N/A')}</em></p>
        </div>

        <div class="section">
            <div class="label">Session ID:</div>
            <div>{session['session_id']}</div>
        </div>

        <div class="section">
            <div class="label">Attacker Profile</div>
            <table>
                <tr><th>Field</th><th>Value</th></tr>
                <tr><td>IP Address</td><td>{session.get('attacker_ip', 'N/A')}</td></tr>
                <tr><td>User Agent</td><td>{session.get('attacker_user_agent', 'N/A')[:60]}...</td></tr>
                <tr><td>Dwell Time</td><td>{len(session.get('visited_pages', []))} pages</td></tr>
            </table>
        </div>

        <div class="section">
            <div class="label">Captured Credentials (Fake)</div>
            <table>
                <tr><th>Field</th><th>Value</th></tr>
                <tr><td>Username</td><td>{creds.get('username', 'N/A')}</td></tr>
                <tr><td>Password</td><td class="watermark">{redacted_pass}</td></tr>
                <tr><td>Page Captured</td><td>{creds.get('page', 'N/A')}</td></tr>
            </table>
        </div>

        <div class="section">
            <div class="label">Attacker Path</div>
            <ol>
                {''.join(f'<li>{page}</li>' for page in session.get('visited_pages', []))}
            </ol>
        </div>

        <div class="watermark">
            <p>🔒 This report contains INTELLIGENCE ONLY — no real credentials were exposed.</p>
            <p>Cerberus Defense Suite • AI for National Prosperity</p>
        </div>
    </body>
    </html>
    """

    HTML(string=html_content).write_pdf(output_path)
    return output_path