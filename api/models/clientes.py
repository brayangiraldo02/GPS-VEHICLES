from sqlalchemy import Column, Integer, Numeric, Date, Text, DateTime, DECIMAL, CHAR, Boolean
from config.dbconnection import Base

class Clientes(Base):
  __tablename__ = 'CLIENTES'

  CODIGO = Column(CHAR(30), primary_key=True, nullable=False)
  NOMBRE = Column(CHAR(50))
  ID_CIUDAD = Column(CHAR(5))
  DIRECCION = Column(CHAR(120))
  TELEFONO = Column(CHAR(30))
  TELEFONO2 = Column(CHAR(30))
  TELEFONO3 = Column(CHAR(30))
  NOM_CONTACTO = Column(CHAR(50))
  CORREO = Column(CHAR(30))
  CORREO2 = Column(CHAR(30))
  REPRESENTANTE_LEGAL = Column(CHAR(40))
  ESTADO = Column(Integer)
  DESCUENTO = Column(DECIMAL(5, 2))
  FEC_INGRESO = Column(Date)
  FEC_FACTURACION = Column(Date)
  USU_CREADO = Column(CHAR(12))
  FEC_CREADO = Column(DateTime)