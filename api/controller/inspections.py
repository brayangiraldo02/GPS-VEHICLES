from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from models.tiposinspeccion import TiposInspeccion

# ---------------------------------------------------------------------------------------------------------------

async def inspections_types(db: Session):
  try:
    inspections = db.query(TiposInspeccion.ID, TiposInspeccion.NOMBRE).all()

    if not inspections:
      return JSONResponse(content={"message": "No inspection types found"}, status_code=404)
         
    response = [
      {
        'ID': inspection.ID,
        'Name': inspection.NOMBRE
      } for inspection in inspections
    ]
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)