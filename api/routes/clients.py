from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.dbconnection import get_db
from controller.clients import clients_info

clients_router = APIRouter()

@clients_router.get('/', tags=["Clients"])
async def get_clients(db: Session = Depends(get_db)):
  return await clients_info(db)