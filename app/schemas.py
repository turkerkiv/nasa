from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ArticleBase(BaseModel):
    id: int
    title: Optional[str] = None
    abstract: Optional[str] = None
    publication_date: Optional[datetime] = None
    file_name: Optional[str] = None
    keywords: Optional[str] = None
    citation_count: Optional[int] = 0
    author_names: Optional[str] = None
    doi: Optional[str] = None


class ArticleListItem(BaseModel):
    id: int
    title: Optional[str] = None
    abstract_compressed: Optional[str] = None
    publication_date: Optional[datetime] = None
    keywords: Optional[str] = None
    citation_count: Optional[int] = 0
    author_names: Optional[str] = None


class PaginatedArticles(BaseModel):
    items: list[ArticleListItem]
    total: int
    page: int
    page_size: int


class ChatRequest(BaseModel):
    article_id: int
    message: str


class YearCount(BaseModel):
    year: int
    count: int


class YearTrending(BaseModel):
    year: int
    article: ArticleListItem


class PillInfo(BaseModel):
    id: int
    article_id: int
    study_subject: str | None = None
    environment_type: str | None = None
    duration: str | None = None
    biological_focus: str | None = None
    study_type: str | None = None
    primary_finding: str | None = None
    sample_info: str | None = None
    intervention_treatment: str | None = None
    statistical_evidence: bool | None = False
