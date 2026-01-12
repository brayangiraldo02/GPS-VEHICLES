from fastapi import APIRouter, Response, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from schemas.users import LoginRequest
from controller.users import process_login, refresh_access_token
from sqlalchemy.orm import Session
from config.dbconnection import get_db

users_router = APIRouter()

@users_router.post('/login/', tags=["Users"])
async def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
  login_result = await process_login(data, db)

  if 'error' in login_result:
    return JSONResponse(content=jsonable_encoder({'message': login_result['error']}), status_code=login_result['status_code'])
  
  response.set_cookie(
    key="access_token", 
    value=login_result['access_token'], 
    httponly=True, 
    secure=True, 
    samesite='strict',
    max_age=10*60  # 10 minutos
  )
  response.set_cookie(
    key="refresh_token",
    value=login_result['refresh_token'],
    httponly=True,
    secure=True,
    samesite='strict',
    max_age=600*60  # 10 horas
  )
  return JSONResponse(content=jsonable_encoder({'token': login_result['token_localStorage']}), status_code=login_result['status_code'])

# ---------------------------------------------------------------------------------------------------------------

@users_router.post('/refresh-token/', tags=["Users"])
async def refresh_token(request: Request, response: Response):
  refresh_cookie = request.cookies.get('refresh_token')

  result = await refresh_access_token(refresh_cookie)

  if 'error' in result:
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return JSONResponse(content=jsonable_encoder({'message': result['error']}), status_code=result['status_code'])
    
  response.set_cookie(
    key="access_token", 
    value=result['access_token'], 
    httponly=True, 
    secure=True, 
    samesite='strict',
    max_age=10*60  # 10 minutos
  )
  return JSONResponse(content=jsonable_encoder({'message': 'Token refreshed successfully'}), status_code=200)