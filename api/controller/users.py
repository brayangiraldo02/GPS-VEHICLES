from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from config.dbconnection import session
from security.jwt_handler import create_access_token, create_refresh_token, decode_refresh_token
from schemas.users import LoginRequest
from models.usuarios import Usuarios
from dotenv import load_dotenv
import os

load_dotenv()

# ---------------------------------------------------------------------------------------------------------------

async def process_login(data: LoginRequest):
  db = session()
  user_admin = os.getenv('USER_ADMIN')
  password_admin = os.getenv('PASSWORD_ADMIN')
  try:
    if data.username == user_admin and data.password == password_admin:
      user_data_cookie = {
        "codigo": user_admin,
      }
      user_data_localStorage = {
        "id": user_admin,
        "nombre": "Administrador",
      }
      token_cookie = create_access_token(user_data_cookie)
      refresh_access_token = create_refresh_token(user_data_cookie)
      token_localStorage = create_access_token(user_data_localStorage)
      
      return {
        'token_cookie': token_cookie, 
        'refresh_token': refresh_access_token,
        'token_localStorage': token_localStorage, 
        'status_code':200
      }
    
    user = db.query(Usuarios).filter(Usuarios.CODIGO == data.username).first()
    
    if not user:
      return {'error': 'Usuario no encontrado', 'status_code':404}
    if user.CONTRASEÑA != data.password:
      return {'error': 'Contraseña incorrecta', 'status_code':401}
    if user.ESTADO == 0:
      return {'error': 'Usuario inactivo', 'status_code':403}

    user_data_payload = {"codigo": user.CODIGO} # Datos mínimos para el token

    access_token = create_access_token(user_data_payload)
    refresh_token = create_refresh_token(user_data_payload)
    
    token_localStorage = create_access_token({"id": user.CODIGO, "nombre": user.NOMBRE})

    return {
      'access_token': access_token,
      'refresh_token': refresh_token,
      'token_localStorage': token_localStorage,
      'status_code': 200
    }
  except Exception as e:
    return {'error': str(e), 'status_code':500}
  finally:
    db.close()

# ---------------------------------------------------------------------------------------------------------------

async def refresh_access_token(refresh_token: str):
  try:
    if not refresh_token:
      return {'error': 'Refresh token missing', 'status_code':401}
    
    user_data = decode_refresh_token(refresh_token)

    if "error" in user_data:
      return {'error': user_data['error'], 'status_code':401}
    
    new_payload = {"codigo": user_data['codigo']}
    new_access_token = create_access_token(new_payload)

    return {'access_token': new_access_token, 'status_code':200}
  except Exception as e:
    return {'error': str(e), 'status_code':500}