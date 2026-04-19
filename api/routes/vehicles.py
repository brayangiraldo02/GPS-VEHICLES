from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.dbconnection import get_db
from controller.vehicles import vehicles_per_owner

vehicles_router = APIRouter()

@vehicles_router.post('/vehicles-per-owner/', tags=["Vehicles"])
async def post_vehicles(owner_id: str = None, db: Session = Depends(get_db)):
  return await vehicles_per_owner(owner_id, db)