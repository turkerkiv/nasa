from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArticleBase(BaseModel):
    id: int
    title: str
    abstract: str
    publication_date: datetime
    file_name: str
    keywords: list[str]
    citation_count: int
    author_names: Optional[list[str]] = []
    article_url: str


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
