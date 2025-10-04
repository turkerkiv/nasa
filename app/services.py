from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import ArticleRepository
from app.schemas import ArticleRead, PaginatedArticles


class ArticleService:
    def __init__(self, db: AsyncSession):
        self.repo = ArticleRepository(db)

    async def get_all(self, page: int = 1, page_size: int = 10) -> PaginatedArticles:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 10

        offset = (page - 1) * page_size
        items, total = await self.repo.get_all(limit=page_size, offset=offset)

        pydantic_items: List[ArticleRead] = []
        for a in items:
            pydantic_items.append(ArticleRead.model_validate(a, from_attributes=True))

        return PaginatedArticles(
            items=pydantic_items, total=total, page=page, page_size=page_size
        )
