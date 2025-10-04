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


class PaginatedArticles(BaseModel):
    items: list[ArticleRead]
    total: int
    page: int
    page_size: int
