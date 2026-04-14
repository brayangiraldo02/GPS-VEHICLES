from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes.login import login_router
from routes.vehicles import vehicles_router
from routes.owners import owners_router
from routes.inspections import inspections_router
from routes.users import users_router
from security.deps import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import text
from config.dbconnection import Base, engine, get_db

app = FastAPI()
# app = FastAPI(root_path="/api", docs_url=None, redoc_url=None, openapi_url=None)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router, prefix="/users")
app.include_router(users_router, prefix="/users", dependencies=[Depends(get_current_user)])
app.include_router(vehicles_router, prefix="/vehicles", dependencies=[Depends(get_current_user)])
app.include_router(owners_router, prefix="/owners", dependencies=[Depends(get_current_user)])
app.include_router(inspections_router, prefix="/inspections", dependencies=[Depends(get_current_user)])

@app.get("/", dependencies=[Depends(get_current_user)])
def main():
  return {"Hello": "World"}
