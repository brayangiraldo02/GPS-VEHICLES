from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.dbconnection import get_db
from controller.vehicles import vehicles_per_owner

vehicles_router = APIRouter()

@vehicles_router.get('/vehicles-per-owner/{owner_id}/', tags=["Vehicles"])
async def get_vehicles(owner_id: str = None, db: Session = Depends(get_db)):
  return await vehicles_per_owner(owner_id, db)