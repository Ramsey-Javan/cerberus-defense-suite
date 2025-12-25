from fastapi import FastAPI
from app.api import phishing, authentication, bec, alerts


app = FastAPI( title = "Cerberus Defense Suite MVP")

@app.get("/")
def root():
    return {"message": "Welcome to Cerberus Defense Suite MVP"}

# routes 
app.include_router(phishing.router) #prefix="/phishing")
app.include_router(authentication.router) #prefix="/auth")
app.include_router(bec.router )#prefix="/bec")
app.include_router(alerts.router) #prefix="/alerts") 