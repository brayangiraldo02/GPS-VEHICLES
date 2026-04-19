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