from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from models.tiposinspeccion import TiposInspeccion
from models.inspecciones import Inspecciones
from models.vehiculos import Vehiculos
from models.propietarios import Propietarios
from models.usuarios import Usuarios
from schemas.inspections import NewInspection
from datetime import datetime
import pytz

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
    return JSONResponse(content={"message": str(e)}, status_code=500)