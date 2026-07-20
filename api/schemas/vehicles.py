from pydantic import BaseModel
from typing import Optional

class VehiclePagination(BaseModel):
  page_number: int
  page_size: int
  search: Optional[str] = None