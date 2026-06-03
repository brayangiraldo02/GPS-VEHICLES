from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import UploadFile, File
from typing import List
from sqlalchemy.orm import Session
from models.tiposinspeccion import TiposInspeccion
from models.inspecciones import Inspecciones
from models.vehiculos import Vehiculos
from models.propietarios import Propietarios
from models.usuarios import Usuarios
from models.estados import Estados
from schemas.inspections import NewInspection, InspectionInfo
from utils.inspections import update_expired_inspections
from datetime import datetime, timedelta
import pytz
import os
import shutil
from dotenv import load_dotenv

load_dotenv()

upload_directory = os.getenv('DIRECTORY_DOC')
route_api = os.getenv('ROUTE_API')

# ---------------------------------------------------------------------------------------------------------------

async def inspections_types(db: Session):
  try:
    inspections = db.query(TiposInspeccion.ID, TiposInspeccion.NOMBRE).all()

    if not inspections:
      return JSONResponse(content={"message": "No inspection types found"}, status_code=404)
         
    response = [
      {
        'id': inspection.ID,
        'name': inspection.NOMBRE
      } for inspection in inspections
    ]
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)
  
# ---------------------------------------------------------------------------------------------------------------

async def create_inspection(data: NewInspection, db: Session, current_user: dict):
  try:
    vehicle = db.query(Vehiculos).filter(Vehiculos.ID == data.vehicle_id).first()
    if not vehicle:
      return JSONResponse(content={"message": "Vehicle not found"}, status_code=404)

    owner = db.query(Propietarios).filter(Propietarios.ID == vehicle.ID_PROPIE).first()
    if not owner:
      return JSONResponse(content={"message": "Owner not found"}, status_code=404)
    
    inspection_type = db.query(TiposInspeccion).filter(TiposInspeccion.ID == data.inspection_type_id).first()
    if not inspection_type:
      return JSONResponse(content={"message": "Inspection type not found"}, status_code=404)
    
    user_id = current_user.get("codigo")
    user = db.query(Usuarios).filter(Usuarios.ID == user_id).first()
    
    panama_timezone = pytz.timezone('America/Panama')
    now_in_panama = datetime.now(panama_timezone)
    date = now_in_panama.strftime("%Y-%m-%d")
    time = now_in_panama.strftime("%I:%M:%S %p")

    new_inspection = Inspecciones(
      FECHA=date,
      HORA=time,
      ID_VEHICULO=vehicle.ID,
      PLACA=vehicle.PLACA,
      PROPIETARIO=vehicle.ID_PROPIE,
      NOMPROPI=owner.NOMBRE,
      TIPO_INSPEC=inspection_type.ID,
      NOMINSPEC=inspection_type.NOMBRE,
      TIPO_INSTALACION=data.instalation_type,
      KILOMETRAJ=data.mileage,
      GPS_SERIAL=data.gps_serial,
      CEL_NUMERO=data.celular_number,
      CEL_SERIAL=data.celular_serial,
      DESCRIPCION=data.description,
      OBSERVA=data.notes if data.notes else "",
      USUARIO=user.ID if user else "",
      NOMUSUARIO=user.NOMBRE if user else "",
      ESTADO="PEN",
      FEC_CREADO=now_in_panama.strftime("%Y-%m-%d %H:%M:%S")
    )

    db.add(new_inspection)
    db.commit()

    return JSONResponse(content={"id": new_inspection.ID}, status_code=201)
  except Exception as e:
    db.rollback()
    return JSONResponse(content={"message": str(e)}, status_code=500)

# ---------------------------------------------------------------------------------------------------------------

async def upload_images(inspection_id: int, db: Session, images: List[UploadFile] = File(...)):
  try:
    inspection = db.query(Inspecciones).filter(Inspecciones.ID == inspection_id).first()
    if not inspection:
      return JSONResponse(content={"message": "Inspection not found"}, status_code=404)

    vehicle_id = inspection.ID_VEHICULO

    available_slots = []
    for i in range(1, 9):
      column_name = f"FOTO{i:02d}"
      if not getattr(inspection, column_name):
        available_slots.append(column_name)

    if not available_slots:
      return JSONResponse(
        content={"message": "No hay espacios disponibles para guardar más fotos."},
        status_code=400
      )
        
    full_inspection_path = os.path.join(upload_directory, "vehicles", vehicle_id, "inspections", str(inspection_id))
    os.makedirs(full_inspection_path, exist_ok=True)

    saved_count = 0
    for slot_name, image in zip(available_slots, images):
      _, ext = os.path.splitext(image.filename)
      new_filename = f"{slot_name.lower()}{ext}"
      
      full_file_path = os.path.join(full_inspection_path, new_filename)
      with open(full_file_path, "wb") as buffer:
          shutil.copyfileobj(image.file, buffer)
      
      relative_db_path = os.path.join("vehicles", vehicle_id, "inspections", str(inspection_id), new_filename)
      normalized_path = relative_db_path.replace("\\", "/") 
      setattr(inspection, slot_name, normalized_path) 
      saved_count += 1

    panama_timezone = pytz.timezone('America/Panama')
    now_in_panama = datetime.now(panama_timezone)
    date = now_in_panama.strftime("%Y-%m-%d")
    time = now_in_panama.strftime("%I:%M:%S %p")

    inspection.FECHA = date
    inspection.HORA = time
    inspection.ESTADO = "FIN"
    inspection.NRO_FOTOS = saved_count

    db.commit()

    message = f"{saved_count} de {len(images)} imágenes fueron guardadas."
    if len(images) > saved_count:
      message += f" {len(images) - saved_count} fueron descartadas por falta de espacio."

    return JSONResponse(content={"message": message}, status_code=201)
  except Exception as e:
    db.rollback()
    return JSONResponse(content={"message": str(e)}, status_code=500)
  
# ---------------------------------------------------------------------------------------------------------------

async def upload_signature(inspection_id: int, db: Session, signature: UploadFile = File(...)):
  try:
    inspection = db.query(Inspecciones).filter(Inspecciones.ID == inspection_id).first()
    if not inspection:
      return JSONResponse(content={"message": "Inspection not found"}, status_code=404)
    
    if inspection.FIRMA:
      return JSONResponse(content={"message": "Ya existe una firma para esta inspección."}, status_code=400)
    
    vehicle_id = inspection.ID_VEHICULO

    full_signature_path = os.path.join(upload_directory, "vehicles", vehicle_id, "inspections", str(inspection_id))
    os.makedirs(full_signature_path, exist_ok=True)

    _, ext = os.path.splitext(signature.filename)
    new_filename = f"firma{ext}"
    
    full_file_path = os.path.join(full_signature_path, new_filename)
    with open(full_file_path, "wb") as buffer:
      shutil.copyfileobj(signature.file, buffer)
    
    relative_db_path = os.path.join("vehicles", vehicle_id, "inspections", str(inspection_id), new_filename)
    normalized_path = relative_db_path.replace("\\", "/") 
    inspection.FIRMA = normalized_path 

    db.commit()

    return JSONResponse(content={"message": "Signature uploaded successfully"}, status_code=201)
  except Exception as e:
    db.rollback()
    return JSONResponse(content={"message": str(e)}, status_code=500)

# ---------------------------------------------------------------------------------------------------------------

async def inspections_list(data: InspectionInfo, db: Session, current_user: dict):
  try:
    panama_timezone = pytz.timezone('America/Panama')
    now_in_panama = datetime.now(panama_timezone)
    today = now_in_panama.date()
    yesterday = today - timedelta(days=1)

    filters = []

    if data.initial_date != '' and data.final_date != '':
        filters.append(Inspecciones.FECHA >= data.initial_date)
        filters.append(Inspecciones.FECHA <= data.final_date)
    
    if data.owner != '':
        filters.append(Inspecciones.PROPIETARIO == data.owner)
    
    if data.vehicle_id != '':
        filters.append(Inspecciones.ID_VEHICULO == data.vehicle_id)

    if not filters:
      inspections = db.query(Inspecciones).filter(Inspecciones.FECHA >= yesterday).order_by(Inspecciones.FECHA.desc(), Inspecciones.HORA.desc()).all()
    else:
      inspections = db.query(Inspecciones).filter(*filters).order_by(Inspecciones.FECHA.desc(), Inspecciones.HORA.desc()).all()

    if not inspections:
      return JSONResponse(content={"message": "No inspections found"}, status_code=404)

    await update_expired_inspections(db, inspections_list=inspections)

    inspections_types = db.query(TiposInspeccion).all()

    inspections_dict = {inspection.ID: inspection.NOMBRE for inspection in inspections_types}

    owners_dict = {owner.ID: owner.NOMBRE for owner in db.query(Propietarios).all()}

    inspections_data = []

    for inspection in inspections:
      photos = []
      for i in range(1, 9): 
        photo_field = f"FOTO{i:02d}"
        photo_value = getattr(inspection, photo_field, "")
        if photo_value and photo_value.strip(): 
          photo_url = f"{route_api}uploads/vehicles/{photo_value}"
          photos.append(photo_url)

      signature_url = f"{route_api}uploads/vehicles/{inspection.FIRMA}" if inspection.FIRMA and inspection.FIRMA.strip() else ''

      can_edit = 1 if (inspection.ESTADO == "PEN" and current_user.get("codigo") and str(inspection.USUARIO) == current_user.get("codigo")) else 0

      user = db.query(Usuarios).filter(Usuarios.ID == str(inspection.USUARIO)).first()
      
      inspections_data.append({
        "id": inspection.ID,
        "date": inspection.FECHA.strftime('%d-%m-%Y') + ' ' + inspection.HORA.strftime('%H:%M') if inspection.FECHA and inspection.HORA else None,
        "id_inspection_type": inspection.TIPO_INSPEC,
        "inspection_type": inspections_dict.get(inspection.TIPO_INSPEC, ""),
        "details": inspection.DESCRIPCION,
        "vehicle_id": inspection.ID_VEHICULO,
        "plate": inspection.PLACA,
        "owner_id": inspection.PROPIETARIO,
        "owner": owners_dict.get(inspection.PROPIETARIO, ""),
        "status": inspection.ESTADO,
        "can_edit": can_edit,
        "photos": photos,
        "signature": [signature_url],
        "user": user.NOMBRE if user else "",
      })

    if not inspections_data:
      return JSONResponse(content={"message": "No inspections found"}, status_code=404)
    return JSONResponse(content=jsonable_encoder(inspections_data), status_code=200)
  except Exception as e:
    db.rollback()
    return JSONResponse(content={"message": str(e)}, status_code=500)
  finally:
    db.close()

# ---------------------------------------------------------------------------------------------------------------

async def inspection_details(inspection_id: int, db: Session):
  try:
    inspection = db.query(Inspecciones).filter(Inspecciones.ID == inspection_id).first()
    if not inspection:
      return JSONResponse(content={"message": "Inspection not found"}, status_code=404)

    await update_expired_inspections(db, inspections_list=[inspection])

    vehicle = db.query(Vehiculos).filter(Vehiculos.ID == inspection.ID_VEHICULO).first()
    if not vehicle:
      return JSONResponse(content={"message": "Vehicle not found"}, status_code=404)

    owner = db.query(Propietarios).filter(Propietarios.ID == inspection.PROPIETARIO).first()
    if not owner:
      return JSONResponse(content={"message": "Owner not found"}, status_code=404)
    
    inspection_type = db.query(TiposInspeccion).filter(TiposInspeccion.ID == inspection.TIPO_INSPEC).first()
    if not inspection_type:
      return JSONResponse(content={"message": "Inspection type not found"}, status_code=404)

    status = db.query(Estados).filter(Estados.ID == vehicle.ID_ESTADO).first()
    vehicle_status = status.ID + ' - ' + status.NOMBRE if status else ''

    photos = []
    for i in range(1, 9): 
      photo_field = f"FOTO{i:02d}"
      photo_value = getattr(inspection, photo_field, "")
      if photo_value and photo_value.strip(): 
        photo_url = f"{route_api}uploads/vehicles/{photo_value}"
        photos.append(photo_url)

    user = db.query(Usuarios).filter(Usuarios.ID == str(inspection.USUARIO)).first()
    
    inspection_data = {
      "id": inspection.ID,
      "date": inspection.FECHA.strftime('%d-%m-%Y') if inspection.FECHA else None,
      "time": inspection.HORA.strftime('%H:%M') if inspection.HORA else None,
      "owner": inspection.PROPIETARIO,
      "owner_name": owner.NOMBRE,
      "inspection_type": inspection.TIPO_INSPEC + ' - ' + inspection_type.NOMBRE,
      "instalation_type": inspection.TIPO_INSTALACION,
      "vehicle_id": inspection.ID_VEHICULO,
      "plate": vehicle.PLACA,
      "vehicle_status": vehicle_status,
      "mileage": inspection.KILOMETRAJ if inspection.KILOMETRAJ else "",
      "gps_serial": inspection.GPS_SERIAL if inspection.GPS_SERIAL else "",
      "celular_number": inspection.CEL_NUMERO if inspection.CEL_NUMERO else "",
      "celular_serial": inspection.CEL_SERIAL if inspection.CEL_SERIAL else "",
      "description": inspection.DESCRIPCION,
      "notes": inspection.OBSERVA if inspection.OBSERVA else "",
      "status": inspection.ESTADO,
      "user": user.NOMBRE if user else "",
      "photos": photos,
      "signature": 1 if inspection.FIRMA and inspection.FIRMA.strip() else 0
    }

    return JSONResponse(content=jsonable_encoder(inspection_data), status_code=200)
  except Exception as e:
    return JSONResponse(content={"message": str(e)}, status_code=500)