from sqlalchemy import Column, DateTime, CHAR, Integer
from config.dbconnection import Base

class Telefonicas(Base):
  __tablename__ = 'TELEFONICAS'

  ID = Column(CHAR(2), nullable=False)
  NOMBRE = Column(CHAR(30))
  USU_CREADO = Column(CHAR(12))
  FEC_CREADO = Column(DateTime)
  USU_MODIFI = Column(CHAR(12))
  FEC_MODIFI = Column(DateTime)