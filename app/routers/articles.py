from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import services
from app import database
from app.schemas import PaginatedArticles
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter(prefix="/articles", tags=["articles"])


async def get_service(db: AsyncSession = Depends(database.get_db)):
    return services.ArticleService(db)


@router.get("/", response_model=PaginatedArticles)
async def read_articles(
    page: int = 1,
    page_size: int = 10,
    service: services.ArticleService = Depends(get_service),
):
    return await service.get_all(page=page, page_size=page_size)


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


@router.get("/{article_id}", response_model=services.ArticleBase)
async def read_article_detail(
    article_id: int, service: services.ArticleService = Depends(get_service)
):
    article = await service.get_by_id(article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
