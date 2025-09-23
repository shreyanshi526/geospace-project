# app/modules/projects/routes/projectRouter.py
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.auth_dependency import get_current_user
from app.integration.db.postgres import get_db
from app.modules.project.controller.projectController import ProjectController
from app.modules.project.models.projectSchemas import (
    ApiResponse,
    ProjectCreateRequest,
    ProjectResponse,
    ProjectUpdateRequest,
)

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def fetch_projects(
    user_id: Optional[str] = Query(None, description="Filter projects by user_id"),
    session: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Fetch all projects or projects for a given user"""
    try:
        projects = await ProjectController.get_projects(session, user_id)
        return ApiResponse(
            success=True,
            message="Projects fetched successfully",
            data={"projects": projects},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching projects: {str(e)}"
        )


@router.post("/", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    request: ProjectCreateRequest,
    session: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new project"""
    try:
        project = await ProjectController.create_project(
            session, request, created_by=current_user["user_id"]
        )
        return ApiResponse(
            success=True,
            message="Project created successfully",
            data={"project": project},
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")


@router.get("/{p_id}", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def get_project(
    p_id: str,
    session: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get project by project ID (with its sites)"""
    try:
        project_data = await ProjectController.get_project(p_id, session)

        if not project_data:
            raise HTTPException(status_code=404, detail="Project not found")

        return ApiResponse(
            success=True,
            message="Project fetched successfully",
            data=project_data,
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching project: {str(e)}",
        )


@router.put("/{p_id}", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def update_project(
    p_id: str,
    request: ProjectUpdateRequest,
    session: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update a project"""
    try:
        project = await ProjectController.update_project(
            session, p_id, request, updated_by=current_user["user_id"]
        )
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return ApiResponse(
            success=True,
            message="Project updated successfully",
            data={"project": project},
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating project: {str(e)}")


@router.delete("/{p_id}", response_model=ApiResponse, status_code=status.HTTP_200_OK)
async def delete_project(
    p_id: str,
    session: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete a project"""
    try:
        project = await ProjectController.delete_project(session, p_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return ApiResponse(success=True, message="Project deleted successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting project: {str(e)}")
