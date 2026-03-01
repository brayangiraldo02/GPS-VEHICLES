from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.dbconnection import get_db
from controller.owners import owners_list

owners_router = APIRouter()

@owners_router.get('/', tags=["Owners"])
async def get_owners(db: Session = Depends(get_db)):
  return await owners_list(db)