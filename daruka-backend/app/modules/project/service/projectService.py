# app/modules/projects/service/projectService.py
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.common.id_generator import generate_project_id
from app.modules.project.models.projectModel import Project
from app.modules.project.repo.projectRepo import ProjectRepo
from app.modules.sites.repo.siteRepo import SiteRepo


class ProjectService:
    @staticmethod
    async def create_project(
        session: AsyncSession, name: str, description: str, created_by: str
    ):
        if not name or len(name) < 3:
            raise ValueError("Project name must be at least 3 characters long")

        project = Project(
            p_id=generate_project_id(),
            name=name,
            description=description,
            created_by=created_by,
            sites_added_total=0,
        )
        return await ProjectRepo.create_project(session, project)

    @staticmethod
    async def get_project(session: AsyncSession, p_id: str):
        # fetch project
        project = await ProjectRepo.get_project_by_id(session, p_id)
        if not project:
            raise ValueError("Project not found")

        # fetch related sites
        sites = await SiteRepo.get_sites_by_project(session, project_id=p_id)

        return {
            "project": project,
            "sites": sites,
        }

    @staticmethod
    async def list_projects(session: AsyncSession, user_id: str = None):
        return await ProjectRepo.get_all_projects(session, user_id)

    @staticmethod
    async def update_project(
        session: AsyncSession, p_id: str, updated_by: str, **kwargs
    ):
        project = await ProjectRepo.update_project(
            session, p_id, updated_by=updated_by, **kwargs
        )
        if not project:
            raise ValueError("Project not found")
        return project

    @staticmethod
    async def delete_project(session: AsyncSession, p_id: str):
        project = await ProjectRepo.delete_project(session, p_id)
        if not project:
            raise ValueError("Project not found")
        return project
