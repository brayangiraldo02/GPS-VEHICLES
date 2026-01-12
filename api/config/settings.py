from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  DB_TYPE: str
  DB_USER: str
  DB_PASSWORD: str
  DB_HOST: str
  DB_PORT: str
  DB_NAME: str

  @property
  def DATABASE_URL(self) -> str:
      return f"{self.DB_TYPE}://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

  class Config:
    env_file = ".env"
    extra = "ignore"

settings = Settings()