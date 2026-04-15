from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from models.propietarios import Propietarios

# ---------------------------------------------------------------------------------------------------------------

async def owners_list(db: Session):
  try:
    owners = db.query(Propietarios).all()

    if not owners:
      return JSONResponse(content={"message": "No owners found"}, status_code=404)
         
    response = [
      {
        'id': owner.ID, 
        'name': owner.NOMBRE,
        'city': owner.ID_CIUDAD
      } for owner in owners
    ]
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)