from datetime import datetime, timedelta

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.modules.project.models.projectModel import Project
from app.core.common.id_generator import generate_site_analytics_id, generate_site_id
from app.modules.sites.models.siteModal import Site, SiteAnalyticsHistory


class SiteRepo:
    @staticmethod
    async def create_site(session: AsyncSession, **kwargs):
        try:
            site = Site(**kwargs)
            session.add(site)

            await session.execute(
                update(Project)
                .where(Project.p_id == site.project_id)
                .values(sites_added_total=Project.sites_added_total + 1)
            )

            await session.commit()
            return site
        except Exception as e:
            await session.rollback()
            raise RuntimeError(f"DB Error creating site: {str(e)}")

    @staticmethod
    async def get_site_by_id(session: AsyncSession, site_id: str):
        result = await session.execute(select(Site).where(Site.id == site_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_sites_by_project(session: AsyncSession, project_id: str):
        result = await session.execute(
            select(Site).where(Site.project_id == project_id)
        )
        return result.scalars().all()

    @staticmethod
    async def get_sites_by_user(session: AsyncSession, user_id: str):
        result = await session.execute(select(Site).where(Site.created_by == user_id))
        return result.scalars().all()

    @staticmethod
    async def update_site(session: AsyncSession, site_id: str, **kwargs):
        try:
            await session.execute(
                update(Site)
                .where(Site.id == site_id)
                .values(**kwargs)
                .execution_options(synchronize_session="fetch")
            )
            await session.commit()
            return await SiteRepo.get_site_by_id(session, site_id)
        except Exception as e:
            await session.rollback()
            raise RuntimeError(f"DB Error updating site: {str(e)}")

    async def delete_site(session: AsyncSession, site_id: str):
        try:
            site = await SiteRepo.get_site_by_id(session, site_id)
            if site:
                # decrement project counter
                await session.execute(
                    update(Project)
                    .where(Project.p_id == site.project_id)
                    .values(sites_added_total=Project.sites_added_total - 1)
                )

                await session.delete(site)
                await session.commit()
            return site
        except Exception as e:
            await session.rollback()
            raise RuntimeError(f"DB Error deleting site: {str(e)}")

    @staticmethod
    async def add_analytics_history(session: AsyncSession, **kwargs):
        try:
            history = SiteAnalyticsHistory(**kwargs)
            session.add(history)
            await session.commit()
            return history
        except Exception as e:
            await session.rollback()
            raise RuntimeError(f"DB Error adding analytics history: {str(e)}")

    @staticmethod
    async def get_site_analytics_history(
        session: AsyncSession, site_id: str, days: int = 7
    ):
        """Fetch analytics history for the past `days` days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        result = await session.execute(
            select(SiteAnalyticsHistory).where(
                SiteAnalyticsHistory.site_id == site_id,
                SiteAnalyticsHistory.created_at >= cutoff_date,
            )
        )
        return result.scalars().all()

    @staticmethod
    async def get_all_sites(session: AsyncSession, skip: int = 0, limit: int = 10):
        result = await session.execute(select(Site).offset(skip).limit(limit))
        sites = result.scalars().all()
        return sites
