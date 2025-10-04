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
    article_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    authors = relationship(
        "AuthorORM", secondary="article_authors", back_populates="articles"
    )


class AuthorORM(Base):
    __tablename__ = "authors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    articles = relationship(
        "ArticleORM", secondary="article_authors", back_populates="authors"
    )


class ArticleAuthorORM(Base):
    __tablename__ = "article_authors"
    article_id = Column(Integer, ForeignKey("articles.id"), primary_key=True)
    author_id = Column(Integer, ForeignKey("authors.id"), primary_key=True)
