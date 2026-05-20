from models.inspecciones import Inspecciones
from datetime import datetime
import pytz
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

async def update_expired_inspections(db: Session, inspections_list: list = None):
  """
  Función auxiliar para actualizar inspecciones pendientes que han expirado a estado suspendido.
  
  Args:
      db: Sesión de base de datos
      inspections_list: Lista de inspecciones ya consultadas (opcional)
  
  Returns:
      int: Número de inspecciones actualizadas
  """
  try:
    panama_timezone = pytz.timezone('America/Panama')
    current_date = datetime.now(panama_timezone).date()
    
    updated_inspections = 0
    
    if inspections_list:
      inspections_to_update = inspections_list
    else:
      inspections_to_update = db.query(Inspecciones).filter(
          Inspecciones.ESTADO == "PEN"
      ).all()
    
    for inspection in inspections_to_update:
      if (inspection.ESTADO == "PEN" and 
        inspection.FECHA and 
        inspection.FECHA < current_date):
        inspection.ESTADO = "SUS"
        updated_inspections += 1
    
    if updated_inspections > 0:
      db.commit()
    
    return updated_inspections
      
  except Exception as e:
    db.rollback()
    print(f"Error updating expired inspections: {str(e)}")
    return 0
  
async def update_all_expired_inspections(db: Session):
  """Endpoint dedicado para actualizar todas las inspecciones expiradas """
  try:
    updated_count = await update_expired_inspections(db)
    
    return JSONResponse(content={
      "message": f"Actualizadas {updated_count} inspecciones",
      "updated_count": updated_count
    }, status_code=200)
  except Exception as e:
    db.rollback()
    return JSONResponse(content={"message": str(e)}, status_code=500)