# app/modules/projects/controller/projectController.py
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.project.models.projectModel import Project
from app.modules.project.models.projectSchemas import (
    ProjectCreateRequest,
    ProjectResponse,
    ProjectUpdateRequest,
)
from app.modules.project.service.projectService import ProjectService
from app.modules.sites.models.siteSchemas import SiteResponse


class ProjectController:
    @staticmethod
    async def create_project(
        session: AsyncSession, request: ProjectCreateRequest, created_by: str
    ) -> ProjectResponse:
        try:
            project = await ProjectService.create_project(
                session,
                name=request.name,
                description=request.description,
                created_by=created_by,
            )
            return ProjectResponse.from_orm(project)
        except Exception as e:
            raise ValueError(f"Error creating project: {str(e)}")

    @staticmethod
    async def get_project(p_id: str, session: AsyncSession):
        try:
            data = await ProjectService.get_project(session, p_id)
            return {
                "project": ProjectResponse.from_orm(data["project"]),
                "sites": [SiteResponse.from_orm(s) for s in data["sites"]],
            }
        except Exception as e:
            raise ValueError(f"Error fetching project: {str(e)}")

    @staticmethod
    async def get_projects(session: AsyncSession, user_id: str = None):
        try:
            projects = await ProjectService.list_projects(session, user_id)
            return [ProjectResponse.from_orm(p) for p in projects]
        except Exception as e:
            raise ValueError(f"Error fetching projects: {str(e)}")

    @staticmethod
    async def update_project(
        session: AsyncSession, p_id: str, request: ProjectUpdateRequest, updated_by: str
    ):
        try:
            project = await ProjectService.update_project(
                session, p_id, updated_by=updated_by, **request.dict(exclude_unset=True)
            )
            return ProjectResponse.from_orm(project)
        except Exception as e:
            raise ValueError(f"Error updating project: {str(e)}")

    @staticmethod
    async def delete_project(session: AsyncSession, p_id: str):
        try:
            project = await ProjectService.delete_project(session, p_id)
            return ProjectResponse.from_orm(project)
        except Exception as e:
            raise ValueError(f"Error deleting project: {str(e)}")
