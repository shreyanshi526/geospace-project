# app/modules/users/repo/userRepo.py
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.modules.users.models.userModel import User


class UserRepo:
    @staticmethod
    async def create_user(
        session: AsyncSession,
        email: str,
        name: str,
        hashed_password: str,
        role: str = "user",
    ):
        """Create a new user"""
        user = User(email=email, name=name, hashed_password=hashed_password, role=role)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def get_user_by_id(session: AsyncSession, user_id: str):
        """Fetch user by ID"""
        result = await session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_email(session: AsyncSession, email: str):
        """Fetch user by email"""
        result = await session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_users(session: AsyncSession, skip: int = 0, limit: int = 10):
        """Fetch paginated list of users"""
        result = await session.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    @staticmethod
    async def update_user(session: AsyncSession, user_id: str, **kwargs):
        """Update user fields (name, role, etc.)"""
        query = (
            update(User)
            .where(User.id == user_id)
            .values(**kwargs)
            .execution_options(synchronize_session="fetch")
        )
        await session.execute(query)
        await session.commit()

        return await UserRepo.get_user_by_id(session, user_id)

    @staticmethod
    async def delete_user(session: AsyncSession, user_id: str):
        """Delete a user by ID"""
        user = await UserRepo.get_user_by_id(session, user_id)
        if user:
            await session.delete(user)
            await session.commit()
        return user
