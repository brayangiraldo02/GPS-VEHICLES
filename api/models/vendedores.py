from sqlalchemy import Column, DateTime, CHAR
from config.dbconnection import Base

class Vendedores(Base):
  __tablename__ = 'VENDEDORES'

  ID = Column(CHAR(2), nullable=False)
  CEDULA = Column(CHAR(12))
  NOMBRE = Column(CHAR(40))
  TELEFONO = Column(CHAR(20))
  DIRECCION = Column(CHAR(50))
  USU_CREADO = Column(CHAR(12))
  FEC_CREADO = Column(DateTime)
  USU_MODIFI = Column(CHAR(12))
  FEC_MODIFI = Column(DateTime)