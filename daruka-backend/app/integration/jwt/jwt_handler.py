import os
from datetime import datetime, timedelta
from typing import Any, Dict

import jwt
from dotenv import load_dotenv

# 🔐 Load environment variables
load_dotenv()

# Get values from .env (with safe defaults where possible)
JWT_SECRET = os.getenv(
    "JWT_SECRET", "supersecretkey123"
)  # must override in .env for prod
JWT_ALGORITHM = "HS256"  # always SHA-256
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))


class JWTHandler:
    @staticmethod
    def create_tokens(user_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Generate both access and refresh tokens for a user.
        user_data should NOT contain sensitive info like password.
        """

        payload = {
            "user_id": user_data.get("user_id"),
            "user_name": user_data.get("user_name"),
            "user_email": user_data.get("user_email"),
            "role": user_data.get("role"),
        }

        # Access Token
        access_token_payload = {
            **payload,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "type": "access",
        }
        access_token = jwt.encode(
            access_token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM
        )

        # Refresh Token
        refresh_token_payload = {
            "user_id": user_data.get("user_id"),
            "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
            "type": "refresh",
        }
        refresh_token = jwt.encode(
            refresh_token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM
        )

        return {"access_token": access_token, "refresh_token": refresh_token}

    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> Dict[str, Any]:
        """
        Verify token and return payload.
        Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError if invalid.
        """
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            if payload.get("type") != token_type:
                raise jwt.InvalidTokenError("Invalid token type")
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")

    @staticmethod
    def refresh_access_token(refresh_token: str) -> str:
        """
        Use refresh token to generate a new access token.
        """
        try:
            payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            if payload.get("type") != "refresh":
                raise jwt.InvalidTokenError("Not a refresh token")

            new_access_payload = {
                "user_id": payload["user_id"],
                "exp": datetime.utcnow()
                + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
                "type": "access",
            }
            new_access_token = jwt.encode(
                new_access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM
            )
            return new_access_token

        except jwt.ExpiredSignatureError:
            raise Exception("Refresh token expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid refresh token")
