from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from models.clientes import Clientes

# ---------------------------------------------------------------------------------------------------------------

async def clients_info(db: Session):
  try:
    clients = db.query(Clientes).all()
    
    # if not clients:
    #   return JSONResponse(content={"message": "No clients found"}, status_code=404)
         
    response = [
        {
          'id': client.CODIGO, 
          'name': client.NOMBRE,
          'city': client.ID_CIUDAD,
        } for client in clients
    ]
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)