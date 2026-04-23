from pydantic import BaseModel
from typing import Optional

class NewInspection(BaseModel):
  vehicle_id: str
  inspection_type_id: str
  mileage: int
  gps_serial: str
  celular_number: str
  celular_serial: str
  description: str
  notes: Optional[str]
  instalation_type: str