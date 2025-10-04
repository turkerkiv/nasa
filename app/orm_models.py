from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from database import Base


class ArticleORM(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    abstract = Column(String)
    publication_date = Column(DateTime)
    file_name = Column(String)
    keywords = Column(String)
    citation_count = Column(Integer, default=0)
    article_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuthorORM(Base):
    __tablename__ = "authors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class ArticleAuthorORM(Base):
    __tablename__ = "article_authors"
    article_id = Column(Integer, primary_key=True)
    author_id = Column(Integer, primary_key=True)
