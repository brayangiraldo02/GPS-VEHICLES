from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes.users import users_router
from routes.clients import clients_router
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

app.include_router(users_router, prefix="/users")
app.include_router(clients_router, prefix="/clients", dependencies=[Depends(get_current_user)])

@app.get("/", dependencies=[Depends(get_current_user)])
def main():
  return {"Hello": "World"}
