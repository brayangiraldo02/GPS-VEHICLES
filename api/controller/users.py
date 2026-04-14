from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from models.usuarios import Usuarios

# ---------------------------------------------------------------------------------------------------------------

async def user_info(db: Session, current_user: dict):
  try:
    user_id = current_user.get("codigo")

    user = db.query(Usuarios).filter(Usuarios.ID == user_id).first()

    if not user:
      return JSONResponse(content={"message": "User not found"}, status_code=404)

    response = {
      "id": user.ID,
      "nombre": user.NOMBRE
    }
    
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)