from fastapi import Request, HTTPException, status
from security.jwt_handler import decode_access_token

async def get_current_user(request: Request):
  token = request.cookies.get("access_token")
  
  if not token:
    raise HTTPException(
      status_code=401,
      detail="No se encontró token de autenticación (Cookie missing)",
    )

  payload = decode_access_token(token)

  if "error" in payload:
    raise HTTPException(
      status_code=401,
      detail=payload["error"],
    )
  
  return payload