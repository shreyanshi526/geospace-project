# app/modules/users/controller/usersController.py
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.models.userModel import (
    ApiResponse,
    SigninRequest,
    SigninResponse,
    SignupRequest,
    SignupResponse,
    UserResponse,
    UserUpdateRequest,
)
from app.modules.users.service.userService import UserService


class UserController:
    @staticmethod
    async def create(
        user_request: SignupRequest, session: AsyncSession
    ) -> SignupResponse:
        """Register a new user"""
        try:
            user, tokens = await UserService.create_user(user_request, session)

            return SignupResponse(
                access_token=tokens["access_token"],
                refresh_token=tokens["refresh_token"],
                token_type="bearer",
                user=UserResponse.from_orm(user),
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user: {str(e)}",
            )

    @staticmethod
    async def signin(
        signin_request: SigninRequest, session: AsyncSession
    ) -> SigninResponse:
        """Authenticate user and return tokens"""
        try:
            tokens, user = await UserService.authenticate_user(signin_request, session)
            return SigninResponse(
                access_token=tokens["access_token"],
                refresh_token=tokens["refresh_token"],
                user=UserResponse.from_orm(user),
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid login: {str(e)}",
            )

    @staticmethod
    async def signout(user_id: str) -> ApiResponse:
        """Sign out (dummy, client should just discard tokens)"""
        return ApiResponse(success=True, message="Signed out successfully")

    @staticmethod
    async def get_by_id(user_id: str, session: AsyncSession) -> UserResponse:
        """Fetch user by ID"""
        try:
            user = await UserService.get_user_by_id(user_id, session)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )
            return UserResponse.from_orm(user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching user: {str(e)}",
            )

    @staticmethod
    async def get_by_email(user_email: str, session: AsyncSession) -> UserResponse:
        """Fetch user by email"""
        try:
            user = await UserService.get_user_by_email(user_email, session)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )
            return UserResponse.from_orm(user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching user: {str(e)}",
            )

    @staticmethod
    async def update(
        user_id: str, user_request: UserUpdateRequest, session: AsyncSession
    ) -> ApiResponse:
        """Update user"""
        try:
            updated_user = await UserService.update_user(user_id, user_request, session)
            return ApiResponse(
                success=True,
                message="User updated successfully",
                data={"user": UserResponse.from_orm(updated_user).dict()},
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating user: {str(e)}",
            )

    @staticmethod
    async def delete(user_id: str, session: AsyncSession) -> ApiResponse:
        """Soft delete user"""
        try:
            await UserService.delete_user(user_id, session)
            return ApiResponse(success=True, message="User deleted successfully")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting user: {str(e)}",
            )
