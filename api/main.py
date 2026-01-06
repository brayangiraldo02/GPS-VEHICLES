from fastapi import FastAPI
from config.dbconnection import Base, engine
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
# app = FastAPI(root_path="/api", docs_url=None, redoc_url=None, openapi_url=None)

Base.metadata.create_all(bind=engine)

@app.get("/")
def main():
  return {"Hello": "World"}