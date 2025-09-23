# app/modules/users/routes/userRouter.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.auth_dependency import get_current_user
from app.integration.db.postgres import get_db
from app.modules.users.controller.userController import UserController
from app.modules.users.models.userModel import (
    ApiResponse,
    SigninRequest,
    SigninResponse,
    SignupRequest,
    SignupResponse,
    UserResponse,
    UserUpdateRequest,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.post(
    "/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED
)
async def signup_user(
    signup_request: SignupRequest,
    session: AsyncSession = Depends(get_db),
):
    """Create a new user (public route)"""
    return await UserController.create(signup_request, session)


@router.post("/signin", response_model=SigninResponse, status_code=status.HTTP_200_OK)
async def signin_user(
    signin_request: SigninRequest,
    session: AsyncSession = Depends(get_db),
):
    """Sign in a user (public route)"""
    return await UserController.signin(signin_request, session)


@router.post("/signout", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def signout_user(current_user: dict = Depends(get_current_user)):
    """Sign out a user (protected)"""
    return await UserController.signout(current_user["user_id"])


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_my_user(
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Get current logged-in user details (protected)"""
    return await UserController.get_by_id(current_user["user_id"], session)


@router.get("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Get user by ID (protected)"""
    return await UserController.get_by_id(user_id, session)


@router.get(
    "/email/{user_email}", response_model=UserResponse, status_code=status.HTTP_200_OK
)
async def get_user_by_email(
    user_email: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Get user by email (protected)"""
    return await UserController.get_by_email(user_email, session)


@router.put("/{user_id}", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def update_user(
    user_id: str,
    user_request: UserUpdateRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Update a user (protected)"""
    return await UserController.update(user_id, user_request, session)


@router.delete("/{user_id}", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Delete a user (soft delete, protected)"""
    return await UserController.delete(user_id, session)
