from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.dbconnection import get_db
from controller.inspections import inspections_types

inspections_router = APIRouter()

@inspections_router.get('/inspections-types/', tags=["Inspections"])
async def get_inspections_types(db: Session = Depends(get_db)):
  return await inspections_types(db)