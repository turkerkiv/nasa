from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import services
from app import database
from app.schemas import PaginatedArticles
from fastapi.responses import FileResponse
from pathlib import Path
from typing import List
from app.schemas import YearCount
from app.schemas import YearTrending, ArticleListItem

router = APIRouter(prefix="/articles", tags=["articles"])


async def get_service(db: AsyncSession = Depends(database.get_db)):
    return services.ArticleService(db)


@router.get("/", response_model=PaginatedArticles)
async def read_articles(
    page: int = 1,
    page_size: int = 10,
    query: str | None = None,
    keyword: str | None = None,
    service: services.ArticleService = Depends(get_service),
):
    return await service.get_all(
        page=page, page_size=page_size, query=query, keyword=keyword
    )


@router.get("/pdf/{filename}")
async def get_article_file(filename: str):
    base = Path(__file__).resolve().parents[1].parent.joinpath("pdf_storage").resolve()
    # Prevent path traversal by resolving and ensuring it is inside base
    requested = (base / filename).resolve()
    if not str(requested).startswith(str(base)):
        raise HTTPException(status_code=400, detail="Invalid filename")
    if not requested.exists() or not requested.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=str(requested),
        headers={"Content-Disposition": f'inline; filename="{requested.name}"'},
        media_type="application/pdf",
    )


@router.get("/keywords", response_model=List[str])
async def get_popular_keywords(
    limit: int = 15, service: services.ArticleService = Depends(get_service)
):
    """
    Return the top `limit` popular keywords across all articles. Defaults to 15.
    """
    if limit < 1:
        limit = 15
    if limit > 100:
        limit = 100
    kws = await service.get_popular_keywords(top_n=limit)
    return kws


@router.get("/counts-by-year", response_model=List[YearCount])
async def get_counts_by_year(service: services.ArticleService = Depends(get_service)):
    """
    Return a list of years and the number of articles published in each year.
    Sorted by year descending.
    """
    pairs = await service.get_article_counts_by_year()
    # service already returns list[dict] with year/count
    return pairs


@router.get("/trending", response_model=List[YearTrending])
async def get_trending_articles(
    years: int = 3,
    min_citations: int = 7,
    min_percentile: float = 0.5,
    service: services.ArticleService = Depends(get_service),
):
    """
    Return trending articles for the most recent `years` years. For each year,
    returns the top-cited article as an ArticleListItem. Default `years`=3.
    """
    if years < 1:
        years = 3
    if years > 10:
        years = 10
    if min_citations < 0:
        min_citations = 0
    if min_percentile < 0.0:
        min_percentile = 0.0
    if min_percentile > 1.0:
        min_percentile = 1.0

    trending = await service.get_trending_articles(
        years=years, min_citations=min_citations, min_percentile=min_percentile
    )
    return trending


@router.get("/{article_id}/similar", response_model=List[ArticleListItem])
async def get_similar_articles(
    article_id: int,
    limit: int = 3,
    service: services.ArticleService = Depends(get_service),
):
    """
    Return up to `limit` articles similar to the given article_id based on shared keywords.
    If not enough similar articles exist, fill the remainder with random articles.
    """
    if limit < 1:
        limit = 3
    if limit > 10:
        limit = 10
    items = await service.get_similar_articles(article_id=article_id, limit=limit)
    return items


@router.get("/{article_id}", response_model=services.ArticleBase)
async def read_article_detail(
    article_id: int, service: services.ArticleService = Depends(get_service)
):
    article = await service.get_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
