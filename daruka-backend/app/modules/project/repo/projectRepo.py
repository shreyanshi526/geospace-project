# app/modules/projects/repo/projectRepo.py
from sqlalchemy import delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.modules.project.models.projectModel import Project


class ProjectRepo:
    @staticmethod
    async def create_project(session: AsyncSession, project: Project):
        session.add(project)
        await session.commit()
        await session.refresh(project)
        return project

    @staticmethod
    async def get_project_by_id(session: AsyncSession, p_id: str):
        result = await session.execute(select(Project).where(Project.p_id == p_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_projects(session: AsyncSession, user_id: str = None):
        query = select(Project)
        if user_id:
            query = query.where(Project.created_by == user_id)
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def update_project(session: AsyncSession, p_id: str, **kwargs):
        query = (
            update(Project)
            .where(Project.p_id == p_id)
            .values(**kwargs)
            .execution_options(synchronize_session="fetch")
        )
        await session.execute(query)
        await session.commit()
        return await ProjectRepo.get_project_by_id(session, p_id)

    @staticmethod
    async def delete_project(session: AsyncSession, p_id: str):
        project = await ProjectRepo.get_project_by_id(session, p_id)
        if project:
            await session.delete(project)
            await session.commit()
        return project
