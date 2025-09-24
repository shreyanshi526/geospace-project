from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, String, Enum, func
from sqlalchemy.orm import relationship
import enum
from app.modules.project.models.projectModel import Project
from app.core.common.id_generator import generate_site_analytics_id, generate_site_id
from app.integration.db.postgres import Base


class SiteStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True, default=generate_site_id, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    project_id = Column(String, ForeignKey("projects.p_id"), nullable=False)

    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    updated_by = Column(String, ForeignKey("users.id"), nullable=True)

    site_type = Column(String, nullable=True)
    area = Column(Float, nullable=True)
    status = Column(Enum(SiteStatus), default=SiteStatus.ACTIVE, nullable=False)

    location = Column(String, nullable=True)
    geolocation = Column(JSON, nullable=True)
    analytics = Column(JSON, nullable=True)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    project = relationship("Project", back_populates="sites")
    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])

    analytics_history = relationship(
        "SiteAnalyticsHistory",
        back_populates="site",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class SiteAnalyticsHistory(Base):
    __tablename__ = "site_analytics_history"

    id = Column(String, primary_key=True, default=generate_site_analytics_id)
    site_id = Column(
        String,
        ForeignKey("sites.id", ondelete="CASCADE"),
        nullable=False,
    )
    project_id = Column(String, ForeignKey("projects.p_id"), nullable=False)

    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    updated_by = Column(String, ForeignKey("users.id"), nullable=True)

    analytics = Column(JSON, nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    site = relationship("Site", back_populates="analytics_history")
