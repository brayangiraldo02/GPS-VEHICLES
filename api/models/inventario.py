from sqlalchemy import Column, DateTime, CHAR, Integer, Text, DECIMAL
from config.dbconnection import Base

class Inventario(Base):
  __tablename__ = 'INVENTARIO'

  ID = Column(CHAR(5), nullable=False)
  CODIGO_BARRAS = Column(CHAR(30))
  NOMBRE = Column(CHAR(60))
  PRESENTACION = Column(CHAR(30))
  ID_GRUPO = Column(CHAR(5))
  EXISTENCIA = Column(DECIMAL(10, 2))
  IVA = Column(Integer)
  COSTO = Column(DECIMAL(12, 2))
  PR_VENTA = Column(DECIMAL(12, 2))
  ESTADO = Column(Integer)
  CPM = Column(Integer)
  MINIMO = Column(Integer)
  MAXIMO = Column(Integer)
  EXCLUIR = Column(Integer)
  ID_REFERENCIA = Column(CHAR(5))
  OBSERVA = Column(Text)
  USU_CREADO = Column(CHAR(12))
  FEC_CREADO = Column(DateTime)