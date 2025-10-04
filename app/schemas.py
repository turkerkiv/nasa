from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArticleBase(BaseModel):
    id: int
    title: str
    abstract: Optional[str] = None
    publication_date: Optional[datetime] = None
    file_name: Optional[str] = None
    keywords: Optional[str] = None


class ArticleRead(ArticleBase):
    created_at: Optional[datetime] = None

    model_config = {"extra": "ignore", "from_attributes": True}


class ArticleListItem(BaseModel):
    id: int
    title: str
    abstract_compressed: str
    publication_date: datetime
    keywords: list[str]
    citation_count: int
    author_names: Optional[list[str]] = []


class PaginatedArticles(BaseModel):
    items: list[ArticleListItem]
    total: int
    page: int
    page_size: int
