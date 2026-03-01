from sqlalchemy import Column, DateTime, CHAR
from config.dbconnection import Base

class Almacenes(Base):
  __tablename__ = 'ALMACENES'

  ID = Column(CHAR(2), nullable=False)
  RUC = Column(CHAR(30))
  NOMBRE = Column(CHAR(50))
  TELEFONO = Column(CHAR(20))
  DIRECCION = Column(CHAR(50))
  CONTACTO = Column(CHAR(50))
  USU_CREADO = Column(CHAR(12))
  FEC_CREADO = Column(DateTime)
  USU_MODIFI = Column(CHAR(12))
  FEC_MODIFI = Column(DateTime)