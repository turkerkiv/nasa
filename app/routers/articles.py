from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app import services
from app import database
from app.schemas import PaginatedArticles

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
