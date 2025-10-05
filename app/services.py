from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import ArticleRepository
from app.schemas import ArticleListItem, PaginatedArticles
from app.schemas import ArticleBase


class ArticleService:
    def __init__(self, db: AsyncSession):
        self.articleRepo = ArticleRepository(db)

    async def get_all(
        self, page: int = 1, page_size: int = 10, query: str | None = None
    ) -> PaginatedArticles:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 10

        offset = (page - 1) * page_size
        items, total = await self.articleRepo.get_all(
            limit=page_size, offset=offset, search=query
        )

        pydantic_items: List[ArticleListItem] = []
        for a in items:
            pydantic_items.append(
                ArticleListItem(
                    id=a.id,
                    title=a.title,
                    publication_date=a.publication_date,
                    citation_count=a.citation_count,
                    abstract_compressed=(
                        a.abstract[:50] + "..."
                        if a.abstract and len(a.abstract) > 50
                        else a.abstract or ""
                    ),
                    keywords=a.keywords,
                    author_names=a.authors,
                )
            )

        return PaginatedArticles(
            items=pydantic_items, total=total, page=page, page_size=page_size
        )

    async def get_by_id(self, article_id: int) -> ArticleBase | None:
        article = await self.articleRepo.get_by_id(article_id)
        if article is None:
            return None

        return ArticleBase(
            id=article.id,
            title=article.title,
            abstract=article.abstract,
            publication_date=article.publication_date,
            file_name=article.file_name,
            keywords=article.keywords,
            citation_count=article.citation_count,
            author_names=article.authors,
        )
