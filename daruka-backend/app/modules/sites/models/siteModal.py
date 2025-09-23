from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.common.id_generator import generate_site_analytics_id, generate_site_id
from app.integration.db.postgres import Base


class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True, default=generate_site_id, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    project_id = Column(String, ForeignKey("projects.p_id"), nullable=False)

    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    updated_by = Column(String, ForeignKey("users.id"), nullable=True)

    area = Column(Float, nullable=True)
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

    # Relationships
    project = relationship("Project", back_populates="sites")
    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])


class SiteAnalyticsHistory(Base):
    __tablename__ = "site_analytics_history"

    id = Column(String, primary_key=True, default=generate_site_analytics_id)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.p_id"), nullable=False)

    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    updated_by = Column(String, ForeignKey("users.id"), nullable=True)

    analytics = Column(JSON, nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
