from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from models.vehiculos import Vehiculos
from models.marcas import Marcas
from models.colores import Colores
from models.tiposvehiculos import TiposVehiculos
from models.propietarios import Propietarios
from models.estados import Estados

# ---------------------------------------------------------------------------------------------------------------

async def vehicles_per_owner(owner_id: str, db: Session):
  try:
    query = db.query(
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
      Vehiculos.CEL_NUMERO.label('Cel_num'),
      Vehiculos.FEC_CREADO
    ).outerjoin(Marcas, Vehiculos.ID_MARCA == Marcas.ID)\
     .outerjoin(Colores, Vehiculos.ID_COLOR == Colores.ID)\
     .outerjoin(TiposVehiculos, Vehiculos.ID_TIPOVEH == TiposVehiculos.ID)\
     .outerjoin(Propietarios, Vehiculos.ID_PROPIE == Propietarios.ID)\
     .outerjoin(Estados, Vehiculos.ID_ESTADO == Estados.ID)

    if owner_id and owner_id.strip() != "":
      query = query.filter(Vehiculos.ID_PROPIE == owner_id)
    
    vehicles = query.all()

    if not vehicles:
      return JSONResponse(content={"message": "No vehicles found"}, status_code=404)
         
    response = [
      {
        'Plate': vehicle.PLACA, 
        'Brand': vehicle.Brand,
        'Model': vehicle.MODELO,
        'Color': vehicle.Color,
        'Vehicle_type': vehicle.Vehicle_type,
        'Owner_id': vehicle.Owner_id,
        'Owner_name': vehicle.Owner_name,
        'Service': vehicle.SERVICIO,
        'Status': vehicle.Status,
        'Cuo_admon': vehicle.CUO_ADMON,
        'Iva': vehicle.IVA,
        'PREND_APAG': vehicle.PREND_APAG,
        'GPS_SERIAL': vehicle.GPS_SERIAL,
        'CEL_SERIAL': vehicle.CEL_SERIAL,
        'CEL_NUM': vehicle.Cel_num,
        'Date_created': vehicle.FEC_CREADO
      } for vehicle in vehicles
    ]
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)