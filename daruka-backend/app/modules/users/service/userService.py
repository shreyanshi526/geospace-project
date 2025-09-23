# app/modules/users/service/usersService.py
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.hashing import hash_password, verify_password
from app.integration.jwt.jwt_handler import JWTHandler
from app.modules.users.models.userModel import (
    SigninRequest,
    SignupRequest,
    UserUpdateRequest,
)
from app.modules.users.repo.userRepo import UserRepo


class UserService:
    @staticmethod
    async def create_user(user_request: SignupRequest, session: AsyncSession):
        """Register a new user"""
        # Validate email format
        if not user_request.email or "@" not in user_request.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email address",
            )

        # Validate password length
        if not user_request.password or len(user_request.password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 6 characters long",
            )

        # Check if user already exists
        existing = await UserRepo.get_user_by_email(session, user_request.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists",
            )

        # Hash password
        hashed_password = hash_password(user_request.password)

        # Save user
        user = await UserRepo.create_user(
            session,
            email=user_request.email,
            name=user_request.name,
            hashed_password=hashed_password,
            role=user_request.role,
        )

        tokens = JWTHandler.create_tokens(
            {
                "user_id": user.id,
                "user_name": user.name,
                "user_email": user.email,
                "role": user.role,
            }
        )

        return user, tokens

    @staticmethod
    async def authenticate_user(signin_request: SigninRequest, session: AsyncSession):
        """Authenticate and return tokens"""
        user = await UserRepo.get_user_by_email(session, signin_request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not verify_password(signin_request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        # Create JWT tokens
        tokens = JWTHandler.create_tokens(
            {
                "user_id": user.id,
                "user_name": user.name,
                "user_email": user.email,
                "role": user.role,
            }
        )

        return tokens, user

    @staticmethod
    async def get_user_by_id(user_id: str, session: AsyncSession):
        """Fetch user by ID"""
        return await UserRepo.get_user_by_id(session, user_id)

    @staticmethod
    async def get_user_by_email(email: str, session: AsyncSession):
        """Fetch user by email"""
        return await UserRepo.get_user_by_email(session, email)

    @staticmethod
    async def update_user(
        user_id: str, user_request: UserUpdateRequest, session: AsyncSession
    ):
        """Update user details"""
        update_data = user_request.dict(exclude_unset=True)

        # If password provided, hash it
        if "password" in update_data:
            update_data["hashed_password"] = hash_password(update_data.pop("password"))

        return await UserRepo.update_user(session, user_id, **update_data)

    @staticmethod
    async def delete_user(user_id: str, session: AsyncSession):
        """Soft delete user"""
        return await UserRepo.delete_user(session, user_id)
