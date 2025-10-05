from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.orm_models import ArticleORM
from sqlalchemy.orm import joinedload


class ArticleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        limit: int | None = None,
        offset: int | None = None,
        search: str | None = None,
    ):
        # total count
        total_result = await self.db.execute(select(ArticleORM))
        total = len(total_result.scalars().all())

        query = select(ArticleORM)

        if search is not None:
            query = query.where(
                ArticleORM.title.ilike(f"%{search}%")
                | ArticleORM.abstract.ilike(f"%{search}%")
            )

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

    async def get_top_keywords(self, top_n: int = 10) -> list[tuple[str, int]]:
        """
        Aggregate keywords from all articles and return a list of (keyword, count)
        sorted by count desc. The ArticleORM.keywords field is stored as a
        delimiter-separated string (commas or semicolons). This method normalizes
        keywords to lower-case and strips whitespace.
        """
        result = await self.db.execute(select(ArticleORM))
        items = result.scalars().all()

        from collections import Counter

        counter: Counter[str] = Counter()

        for a in items:
            kws = a.keywords or ""
            # split on common delimiters
            parts = []
            for part in kws.split(","):
                # further split by semicolon if present
                subparts = part.split(";") if ";" in part else [part]
                parts.extend(subparts)

            for k in parts:
                k_clean = k.strip().lower()
                if not k_clean:
                    continue
                counter[k_clean] += 1

        most_common = counter.most_common(top_n)
        return most_common
