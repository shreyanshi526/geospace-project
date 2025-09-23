from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.integration.jwt.jwt_handler import JWTHandler

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Extracts and verifies JWT access token.
    Returns decoded payload (user info).
    """
    token = credentials.credentials
    try:
        payload = JWTHandler.verify_token(token, token_type="access")
        return payload  # includes user_id, user_name, user_email, user_role
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
