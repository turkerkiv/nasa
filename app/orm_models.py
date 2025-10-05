from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship


class ArticleORM(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    abstract = Column(String)
    publication_date = Column(DateTime)
    file_name = Column(String)
    keywords = Column(String)
    citation_count = Column(Integer, default=0)
    doi = Column(String, unique=True, index=True)
    authors = Column(String)


class ArticlePillInfoORM(Base):
    __tablename__ = "pill_info"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False, index=True)

    study_subject = Column(String)
    environment_type = Column(String)
    duration = Column(String)
    biological_focus = Column(String)
    study_type = Column(String)
    primary_finding = Column(String)
    sample_info = Column(String)
    intervention_treatment = Column(String)
    statistical_evidence = Column(Boolean, default=False)

    # İlişki
    article = relationship("ArticleORM", backref="pill_info")
