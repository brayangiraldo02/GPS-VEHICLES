from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config.settings import settings

engine = create_engine(
  settings.DATABASE_URL,
  pool_recycle=3600,   # Recicla cada 1 hora
  pool_pre_ping=True  # Habilita pre-ping para evitar 'server has gone away'
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
  pass

def get_db():
  """
  Generador de dependencias. Abre una sesión por request y la cierra al terminar.
  Es CRÍTICO para evitar fugas de memoria en la BD.
  """
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()