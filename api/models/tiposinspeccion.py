from sqlalchemy import Column, DateTime, CHAR
from config.dbconnection import Base

class TiposInspeccion(Base):
  __tablename__ = 'TIPOSINSPECCION'

  ID = Column(CHAR(2), nullable=False, primary_key=True)
  NOMBRE = Column(CHAR(30))
  USU_CREADO = Column(CHAR(12))
  FEC_CREADO = Column(DateTime)
  USU_MODIFI = Column(CHAR(12))
  FEC_MODIFI = Column(DateTime)