from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.auth_dependency import get_current_user
from app.integration.db.postgres import get_db
from app.modules.sites.controller.siteController import SiteController
from app.modules.sites.models.siteSchemas import ApiResponse, SiteCreate, SiteUpdate

router = APIRouter(prefix="/sites", tags=["Sites"])


@router.post("/", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
async def create_site(
    data: SiteCreate,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.create_site(session, data, current_user["user_id"])


@router.get("/all", response_model=ApiResponse)
async def get_all_sites(
    skip: int = 0,
    limit: int = 10,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.get_all_sites(
        session=session, skip=skip, limit=limit, current_user=current_user
    )


@router.put("/{site_id}", response_model=ApiResponse)
async def update_site(
    site_id: str,
    data: SiteUpdate,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.update_site(
        session, site_id, data, current_user["user_id"]
    )


@router.delete("/{site_id}", response_model=ApiResponse)
async def delete_site(
    site_id: str,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.delete_site(session, site_id)


@router.get("/{site_id}", response_model=ApiResponse)
async def get_site(
    site_id: str,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.get_site_by_id(session, site_id)


@router.get("/project/{project_id}", response_model=ApiResponse)
async def get_sites_by_project(
    project_id: str,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.get_sites_by_project(session, project_id)


@router.get("/user/{user_id}", response_model=ApiResponse)
async def get_sites_by_user(
    user_id: str,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.get_sites_by_user(session, user_id)


@router.get("/{site_id}/analytics/history", response_model=ApiResponse)
async def get_site_analytics_history(
    site_id: str,
    session: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await SiteController.get_site_analytics_history(
        site_id=site_id, session=session, current_user=current_user
    )
