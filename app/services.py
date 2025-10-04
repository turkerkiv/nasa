from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import ArticleRepository
from app.schemas import ArticleListItem, PaginatedArticles
from app.schemas import ArticleBase


class ArticleService:
    def __init__(self, db: AsyncSession):
        self.articleRepo = ArticleRepository(db)

    async def get_all(self, page: int = 1, page_size: int = 10) -> PaginatedArticles:
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 10

        offset = (page - 1) * page_size
        items, total = await self.articleRepo.get_all(limit=page_size, offset=offset)

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
                    keywords=a.keywords.split(",") if a.keywords else [],
                    author_names=[author.name for author in a.authors],
                )
            )

        return PaginatedArticles(
            items=pydantic_items, total=total, page=page, page_size=page_size
        )

    async def get_by_id(self, article_id: int) -> ArticleBase | None:
        author = await self.articleRepo.get_by_id(article_id)
        if author is None:
            return None

        return ArticleBase(
            id=author.id,
            title=author.title,
            abstract=author.abstract,
            publication_date=author.publication_date,
            file_name=author.file_name,
            keywords=author.keywords.split(",") if author.keywords else [],
            citation_count=author.citation_count,
            author_names=[author.name for author in author.authors],
            article_url=author.article_url,
        )
