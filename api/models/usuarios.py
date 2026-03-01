from sqlalchemy import Column, Integer, Date, Text, CHAR
from config.dbconnection import Base

class Usuarios(Base):
  __tablename__ = 'USUARIOS'

  ID = Column(CHAR(12), primary_key=True, nullable=False)
  NOMBRE = Column(CHAR(40))
  TELEFONO = Column(CHAR(20))
  DIRECCION = Column(CHAR(50))
  ESTADO = Column(Integer)
  FEC_ESTADO = Column(Date)
  OBSERVA = Column(Text)
  OPCION01 = Column(Integer)
  OPCION02 = Column(Integer)
  OPCION03 = Column(Integer)
  OPCION04 = Column(Integer)
  OPCION05 = Column(Integer)
  OPCION06 = Column(Integer)
  OPCION07 = Column(Integer)
  TAREA01 = Column(Integer)
  TAREA02 = Column(Integer)
  TAREA03 = Column(Integer)
  CONTRASEÑA = Column(CHAR(10))
  USU_CREADO = Column(CHAR(12))
  FEC_CREADO = Column(Date)
  USU_MODIFI = Column(CHAR(12))
  FEC_MODIFI = Column(Date)