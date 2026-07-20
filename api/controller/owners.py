from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import cast, Integer
from models.propietarios import Propietarios
from schemas.owner import *

# ---------------------------------------------------------------------------------------------------------------

async def owners_list(db: Session):
  try:
    owners = db.query(Propietarios).all()

    if not owners:
      return JSONResponse(content={"message": "No owners found"}, status_code=404)
         
    response = [
      {
        'id': owner.ID, 
        'name': owner.NOMBRE
      } for owner in owners
    ]
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)
  
# ---------------------------------------------------------------------------------------------------------------

async def all_owners(pagination: OwnerPagination, db: Session):
  try:
    if pagination.page_number < 1 or pagination.page_size < 1:
      return JSONResponse(content={"error": "Page number and page size must be greater than 0"}, status_code=400)

    query = db.query(Propietarios).order_by(cast(Propietarios.ID, Integer)).all()

    owners = [
      {
        'id': owner.ID, 
        'name': owner.NOMBRE,
        'address': owner.DIRECCION,
        'phone': owner.TELEFONO,
        'email': owner.CORREO,
      } for owner in query
    ]

    if pagination.search and pagination.search.strip():
      search_term = pagination.search.strip().lower()
      def matches(owner):
        for key, value in owner.items():
          if value is None:
            continue
          if search_term in str(value).lower():
            return True
        return False
      owners = [owner for owner in owners if matches(owner)]

    total_items = len(owners)
    total_pages = (total_items + pagination.page_size - 1) // pagination.page_size if total_items else 0

    offset = (pagination.page_number - 1) * pagination.page_size

    owners = owners[offset:offset + pagination.page_size]
         
    response = {
      'page_number': pagination.page_number,
      'total_items': total_items,
      'total_pages': total_pages,
      'owners': owners
    }
    
    return JSONResponse(content=jsonable_encoder(response), status_code=200)
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)