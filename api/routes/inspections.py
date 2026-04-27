from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from config.dbconnection import get_db
from controller.inspections import *
from schemas.inspections import NewInspection
from security.deps import get_current_user

inspections_router = APIRouter()

@inspections_router.get('/inspections-types/', tags=["Inspections"])
async def get_inspections_types(db: Session = Depends(get_db)):
  return await inspections_types(db)

@inspections_router.post('/create-inspection/', tags=["Inspections"])
async def post_create_inspection(data: NewInspection, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
  return await create_inspection(data, db, current_user)

@inspections_router.post('/upload-images/{inspection_id}/', tags=["Inspections"])
async def post_upload_images(inspection_id: int, db: Session = Depends(get_db), files: list[UploadFile] = File(...)):
  return await upload_images(inspection_id, db, files)

@inspections_router.post('/upload-signature/{inspection_id}/', tags=["Inspections"])
async def post_upload_signature(inspection_id: int, db: Session = Depends(get_db), signature: UploadFile = File(...)):
  return await upload_signature(inspection_id, db, signature)