from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.orm_models import ArticleORM, AuthorORM


class ArticleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, limit: int | None = None, offset: int | None = None):
        query = select(ArticleORM)
        # total count
        total_result = await self.db.execute(select(ArticleORM))
        total = len(total_result.scalars().all())

        if limit is not None:
            query = query.limit(limit)
        if offset is not None:
            query = query.offset(offset)

        result = await self.db.execute(query)
        items = result.scalars().all()
        return items, total

    async def get_by_id(self, article_id: int):
        result = await self.db.execute(
            select(ArticleORM).where(ArticleORM.id == article_id)
        )
        return result.scalar_one_or_none()

    async def create(self, article: ArticleORM):
        self.db.add(article)
        await self.db.commit()
        await self.db.refresh(article)
        return article


class AuthorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        result = await self.db.execute(select(AuthorORM))
        return result.scalars().all()

    async def get_by_id(self, author_id: int):
        result = await self.db.execute(
            select(AuthorORM).where(AuthorORM.id == author_id)
        )
        return result.scalar_one_or_none()

    async def create(self, author: AuthorORM):
        self.db.add(author)
        await self.db.commit()
        await self.db.refresh(author)
        return author
