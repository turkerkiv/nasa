from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import ArticleRepository, AuthorRepository
from app.schemas import ArticleListItem, PaginatedArticles


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
            author_names = [author.name for author in a.authors]
            print("Author Names:", author_names)
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
                    author_names=author_names,
                )
            )

        return PaginatedArticles(
            items=pydantic_items, total=total, page=page, page_size=page_size
        )
