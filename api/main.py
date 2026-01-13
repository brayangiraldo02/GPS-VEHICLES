from fastapi import FastAPI, Depends
from routes.users import users_router
from security.deps import get_current_user
from sqlalchemy.orm import Session
from sqlalchemy import text
from config.dbconnection import Base, engine, get_db

app = FastAPI()
# app = FastAPI(root_path="/api", docs_url=None, redoc_url=None, openapi_url=None)

app.include_router(users_router, prefix="/users")

@app.get("/", dependencies=[Depends(get_current_user)])
def main():
  return {"Hello": "World"}