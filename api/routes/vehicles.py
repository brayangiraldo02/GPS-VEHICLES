from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.dbconnection import get_db
from controller.vehicles import *

vehicles_router = APIRouter()

@vehicles_router.post('/vehicles-per-owner/', tags=["Vehicles"])
async def post_vehicles(owner_id: str = None, db: Session = Depends(get_db)):
  return await vehicles_per_owner(owner_id, db)

@vehicles_router.post('/info/', tags=["Vehicles"])
async def post_vehicle_info(vehicle_plate: str, db: Session = Depends(get_db)):
  return await vehicle_info(vehicle_plate, db)