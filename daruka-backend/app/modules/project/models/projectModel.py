from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.common.id_generator import generate_project_id
from app.integration.db.postgres import Base


class Project(Base):
    __tablename__ = "projects"

    p_id = Column(String, primary_key=True, default=generate_project_id, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    updated_by = Column(String, ForeignKey("users.id"), nullable=True)

    sites_added_total = Column(Integer, default=0)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # relationships (optional, useful later)
    creator = relationship("User", foreign_keys=[created_by])
    updater = relationship("User", foreign_keys=[updated_by])
    sites = relationship("Site", back_populates="project", cascade="all, delete-orphan")
