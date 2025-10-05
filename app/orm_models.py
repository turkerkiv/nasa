from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
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
