from sqlalchemy.ext.asyncio import AsyncSession

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
from app.modules.sites.repo.siteRepo import SiteRepo


class SiteService:
    @staticmethod
    async def create_site(session: AsyncSession, data, current_user_id: str):
        if not data.name:
            raise ValueError("Site name is required")

        site = await SiteRepo.create_site(
            session,
            name=data.name,
            description=data.description,
            project_id=data.project_id,
            created_by=current_user_id,
            updated_by=current_user_id,
            area=data.area,
            location=data.location,
            geolocation=data.geolocation,
            analytics=data.analytics or {},
        )
        return site

    @staticmethod
    async def update_site(
        session: AsyncSession, site_id: str, data, current_user_id: str
    ):
        site = await SiteRepo.get_site_by_id(session, site_id)
        if not site:
            raise ValueError("Site not found")

        # Save old analytics into history before updating
        if site.analytics:
            await SiteRepo.add_analytics_history(
                session,
                site_id=site.id,
                project_id=site.project_id,
                created_by=site.created_by,
                updated_by=current_user_id,
                analytics=site.analytics,
            )

        updated_site = await SiteRepo.update_site(
            session,
            site_id,
            name=data.name or site.name,
            description=data.description or site.description,
            updated_by=current_user_id,
            area=data.area or site.area,
            location=data.location or site.location,
            geolocation=data.geolocation or site.geolocation,
            analytics=data.analytics or site.analytics,
        )
        return updated_site

    @staticmethod
    async def delete_site(session: AsyncSession, site_id: str):
        site = await SiteRepo.delete_site(session, site_id)
        if not site:
            raise ValueError("Site not found")
        return site


    @staticmethod
    async def get_site_by_id(session: AsyncSession, site_id: str):
        site = await SiteRepo.get_site_by_id(session, site_id)
        if not site:
            raise ValueError("Site not found")
        return site

    @staticmethod
    async def get_sites_by_user(session: AsyncSession, user_id: str):
        sites = await SiteRepo.get_sites_by_user(session, user_id)
        return sites

    @staticmethod
    async def get_sites_by_project(session: AsyncSession, project_id: str):
        sites = await SiteRepo.get_sites_by_project(session, project_id)
        return sites

    @staticmethod
    async def get_site_analytics_history(
        session: AsyncSession, site_id: str, days: int = 7
    ):
        history = await SiteRepo.get_site_analytics_history(session, site_id, days)

        # Convert ORM rows → Pydantic
        history_records = [SiteAnalyticsRecord.from_orm(item) for item in history]

        # Build chart data
        chart: Dict[str, ChartMetric] = {}
        for record in history_records:
            ts = record.created_at.strftime("%Y-%m-%d %H:%M:%S")
            for metric_name, metric_data in record.analytics.items():
                if metric_name not in chart:
                    chart[metric_name] = ChartMetric(
                        unit=metric_data.get("unit", ""), values=[]
                    )
                value = metric_data.get("value")
                if isinstance(value, (int, float)):
                    chart[metric_name].values.append(
                        ChartMetricPoint(x=ts, y=float(value))
                    )

        return SiteAnalyticsHistoryResponse(history=history_records, chart=chart)

    @staticmethod
    async def get_all_sites(session: AsyncSession, skip: int = 0, limit: int = 10):
        return await SiteRepo.get_all_sites(session, skip, limit)
