from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy import func, cast, Integer
from sqlalchemy.orm import Session
from models.vehiculos import Vehiculos
from models.marcas import Marcas
from models.colores import Colores
from models.tiposvehiculos import TiposVehiculos
from models.propietarios import Propietarios
from models.estados import Estados
from schemas.vehicles import *

# ---------------------------------------------------------------------------------------------------------------

async def vehicles_per_owner(owner_id: str, db: Session):
  try:
    query = db.query(
      Vehiculos.ID,
      Vehiculos.PLACA,
      Marcas.NOMBRE.label('Brand'),
      Vehiculos.MODELO,
      Vehiculos.ID_PROPIE.label('Owner_id'),
      Propietarios.NOMBRE.label('Owner_name'),
    ).outerjoin(Marcas, Vehiculos.ID_MARCA == Marcas.ID)\
     .outerjoin(Propietarios, Vehiculos.ID_PROPIE == Propietarios.ID)\
     .outerjoin(Estados, Vehiculos.ID_ESTADO == Estados.ID)

    if owner_id and owner_id.strip() != "":
      query = query.filter(Vehiculos.ID_PROPIE == owner_id)
    
    vehicles = query.all()

    if not vehicles:
      return JSONResponse(content={"message": "No vehicles found"}, status_code=404)
         
    response = [
      {
        'id': vehicle.ID,
        'plate': vehicle.PLACA, 
        'brand': vehicle.Brand,
        'model': vehicle.MODELO,
        'owner_name': vehicle.Owner_name,
      } for vehicle in vehicles
    ]
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)
  
# ---------------------------------------------------------------------------------------------------------------

async def vehicle_info(vehicle_plate: str, db: Session):
  try:
    vehicle = db.query(
      Vehiculos.ID,
      Vehiculos.PLACA,
      Marcas.NOMBRE.label('Brand'),
      Vehiculos.MODELO,
      Colores.NOMBRE.label('Color'),
      TiposVehiculos.NOMBRE.label('Vehicle_type'),
      Vehiculos.ID_PROPIE.label('Owner_id'),
      Propietarios.NOMBRE.label('Owner_name'),
      Vehiculos.SERVICIO,
      Estados.NOMBRE.label('Status'),
      Vehiculos.CUO_ADMON,
      Vehiculos.IVA,
      Vehiculos.PREND_APAG,
      Vehiculos.GPS_SERIAL,
      Vehiculos.CEL_SERIAL,
      Vehiculos.CEL_NUMERO,
      Vehiculos.FEC_CREADO
    ).outerjoin(Marcas, Vehiculos.ID_MARCA == Marcas.ID)\
     .outerjoin(Colores, Vehiculos.ID_COLOR == Colores.ID)\
     .outerjoin(TiposVehiculos, Vehiculos.ID_TIPOVEH == TiposVehiculos.ID)\
     .outerjoin(Propietarios, Vehiculos.ID_PROPIE == Propietarios.ID)\
     .outerjoin(Estados, Vehiculos.ID_ESTADO == Estados.ID)\
     .filter(Vehiculos.PLACA == vehicle_plate).first()

    if not vehicle:
      return JSONResponse(content={"message": "No vehicle found"}, status_code=404)
         
    response = {
      'id': vehicle.ID,
      'plate': vehicle.PLACA, 
      'brand': vehicle.Brand,
      'model': vehicle.MODELO,
      'color': vehicle.Color,
      'vehicle_type': vehicle.Vehicle_type,
      'owner_id': vehicle.Owner_id,
      'owner_name': vehicle.Owner_name,
      'service': vehicle.SERVICIO,
      'status': vehicle.Status,
      'cuo_admon': vehicle.CUO_ADMON,
      'iva': vehicle.IVA,
      'prend_apag': vehicle.PREND_APAG,
      'gps_serial': vehicle.GPS_SERIAL,
      'cel_serial': vehicle.CEL_SERIAL,
      'cel_num': vehicle.CEL_NUMERO,
      'date_created': vehicle.FEC_CREADO
    }

    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)

# ---------------------------------------------------------------------------------------------------------------

async def all_vehicles(pagination: VehiclePagination, db: Session):
  try:
    if pagination.page_number < 1 or pagination.page_size < 1:
      return JSONResponse(content={"message": "Invalid page number or page size"}, status_code=400)

    query = db.query(
      Vehiculos.ID,
      Vehiculos.PLACA,
      Vehiculos.ID_TIPOVEH,
      Vehiculos.ID_ESTADO,
      Vehiculos.ID_PROPIE,
      TiposVehiculos.NOMBRE.label('type_name'),
      Estados.NOMBRE.label('status_name'),
      Propietarios.NOMBRE.label('owner_name'),
    ).outerjoin(TiposVehiculos, Vehiculos.ID_TIPOVEH == TiposVehiculos.ID
    ).outerjoin(Estados, Vehiculos.ID_ESTADO == Estados.ID
    ).outerjoin(Propietarios, Vehiculos.ID_PROPIE == Propietarios.ID).order_by(cast(Vehiculos.ID, Integer)).all()

    vehicles = [
      {
        'id': vehicle.ID,
        'plate': vehicle.PLACA, 
        'owner_id': vehicle.ID_PROPIE,
        'owner_name': vehicle.owner_name if vehicle.owner_name else None,
        'type_id': vehicle.ID_TIPOVEH,
        'type_name': vehicle.type_name if vehicle.type_name else None,
        'status_id': vehicle.ID_ESTADO,
        'status_name': vehicle.status_name if vehicle.status_name else None,
      } for vehicle in query
    ]

    if pagination.search and pagination.search.strip():
      search_term = pagination.search.strip().lower()
      def matches(vehicle):
        for key, value in vehicle.items():
          if value is None:
            continue
          if search_term in str(value).lower():
            return True
        return False
      vehicles = [vehicle for vehicle in vehicles if matches(vehicle)]

    total_items = len(vehicles)
    total_pages = (total_items + pagination.page_size - 1) // pagination.page_size if total_items else 0

    offset = (pagination.page_number - 1) * pagination.page_size

    vehicles = vehicles[offset:offset + pagination.page_size]

    response = {
        'page_number': pagination.page_number,
        'total_items': total_items,
        'total_pages': total_pages,
        'items': vehicles
      }

    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)