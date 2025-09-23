from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security.auth_dependency import get_current_user
from app.integration.db.postgres import get_db
from app.modules.sites.models.siteSchemas import (
    ApiResponse,
    ChartMetric,
    ChartMetricPoint,
    SiteAnalyticsHistoryResponse,
    SiteAnalyticsRecord,
    SiteCreate,
    SiteResponse,
    SiteUpdate,
)
from app.modules.sites.service.siteService import SiteService


class SiteController:
    @staticmethod
    async def create_site(
        session: AsyncSession, data: SiteCreate, current_user_id: str
    ):
        try:
            site = await SiteService.create_site(session, data, current_user_id)
            return ApiResponse(
                success=True,
                message="Site created successfully",
                data={"site": SiteResponse.from_orm(site).dict()},
            )
        except Exception as e:
            return ApiResponse(success=False, message=f"Error creating site: {str(e)}")

    @staticmethod
    async def update_site(
        session: AsyncSession, site_id: str, data: SiteUpdate, current_user_id: str
    ):
        try:
            site = await SiteService.update_site(
                session, site_id, data, current_user_id
            )
            return ApiResponse(
                success=True,
                message="Site updated successfully",
                data={"site": SiteResponse.from_orm(site).dict()},
            )
        except Exception as e:
            return ApiResponse(success=False, message=f"Error updating site: {str(e)}")

    @staticmethod
    async def delete_site(session: AsyncSession, site_id: str):
        try:
            site = await SiteService.delete_site(session, site_id)
            return ApiResponse(
                success=True,
                message="Site deleted successfully",
                data={"site_id": site_id},
            )
        except Exception as e:
            return ApiResponse(success=False, message=f"Error deleting site: {str(e)}")

    @staticmethod
    async def get_site_by_id(session: AsyncSession, site_id: str):
        try:
            site = await SiteService.get_site_by_id(session, site_id)
            return ApiResponse(
                success=True,
                message="Site fetched successfully",
                data={"site": SiteResponse.from_orm(site).dict()},
            )
        except Exception as e:
            return ApiResponse(success=False, message=f"Error fetching site: {str(e)}")

    @staticmethod
    async def get_sites_by_project(session: AsyncSession, project_id: str):
        try:
            sites = await SiteService.get_sites_by_project(session, project_id)
            return ApiResponse(
                success=True,
                message="Sites fetched successfully",
                data={"sites": [SiteResponse.from_orm(site).dict() for site in sites]},
            )
        except Exception as e:
            return ApiResponse(success=False, message=f"Error fetching sites: {str(e)}")

    @staticmethod
    async def get_sites_by_user(session: AsyncSession, user_id: str):
        try:
            sites = await SiteService.get_sites_by_user(session, user_id)
            return ApiResponse(
                success=True,
                message="Sites fetched successfully",
                data={"sites": [SiteResponse.from_orm(site).dict() for site in sites]},
            )
        except Exception as e:
            return ApiResponse(success=False, message=f"Error fetching sites: {str(e)}")

    @staticmethod
    async def get_site_analytics_history(
        site_id: str, session: AsyncSession, current_user
    ):
        try:
            response_data = await SiteService.get_site_analytics_history(
                session=session, site_id=site_id
            )
            return ApiResponse(
                success=True,
                message="Site analytics history fetched successfully",
                data=response_data.dict(),
            )
        except Exception as e:
            return ApiResponse(
                success=False,
                message=f"Error fetching analytics history: {str(e)}",
            )

    @staticmethod
    async def get_all_sites(
        session: AsyncSession, skip: int = 0, limit: int = 10, current_user=None
    ):
        try:
            sites = await SiteService.get_all_sites(
                session=session, skip=skip, limit=limit
            )
            site_records = [SiteResponse.from_orm(site) for site in sites]
            return ApiResponse(
                success=True,
                message="Sites fetched successfully",
                data={"sites": [s.dict() for s in site_records]},
            )
        except Exception as e:
            return ApiResponse(success=False, message=f"Error fetching sites: {str(e)}")
