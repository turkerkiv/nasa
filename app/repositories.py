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

    async def get_counts_by_year(self) -> list[tuple[int, int]]:
        """
        Aggregate article counts by publication year. Returns a list of
        (year, count) tuples sorted by year descending.
        Articles without a publication_date are ignored.
        """
        result = await self.db.execute(select(ArticleORM))
        items = result.scalars().all()

        from collections import Counter

        counter: Counter[int] = Counter()

        for a in items:
            pd = a.publication_date
            if pd is None:
                continue
            # pd is a datetime-like object
            year = getattr(pd, "year", None)
            if year is None:
                continue
            counter[int(year)] += 1

        # sort by year desc
        pairs = sorted(counter.items(), key=lambda x: x[0], reverse=True)
        return pairs

    async def get_trending_articles_by_recent_years(
        self, years: int = 3, min_citations: int = 7, min_percentile: float = 0.5
    ) -> list[tuple[int, ArticleORM]]:
        """
        Return a list of (year, top_article) pairs for the most recent `years` years
        where the top article for the year meets the threshold defined by either
        `min_citations` or the global `min_percentile` of citation counts.

        - `min_citations`: absolute minimum citation count for the top article.
        - `min_percentile`: float in [0,1] used to compute the citation value at that
          percentile across all articles; the top article must meet at least that value.

        Articles without a publication_date are ignored.
        """
        result = await self.db.execute(select(ArticleORM))
        items = result.scalars().all()

        # collect global citation counts for percentile calculation
        counts = [int(a.citation_count or 0) for a in items]

        percentile_threshold = 0
        if counts and 0.0 <= min_percentile <= 1.0:
            sorted_counts = sorted(counts)
            # compute index for percentile: use ceil-like behavior to be conservative
            idx = int(len(sorted_counts) * min_percentile) - 1
            if idx < 0:
                idx = 0
            if idx >= len(sorted_counts):
                idx = len(sorted_counts) - 1
            percentile_threshold = int(sorted_counts[idx])

        # group by year
        from collections import defaultdict

        by_year: dict[int, list[ArticleORM]] = defaultdict(list)
        for a in items:
            pd = a.publication_date
            if pd is None:
                continue
            year = getattr(pd, "year", None)
            if year is None:
                continue
            by_year[int(year)].append(a)

        if not by_year:
            return []

        # get most recent years sorted desc (all years, we'll pick up to `years`)
        sorted_years = sorted(by_year.keys(), reverse=True)

        pairs: list[tuple[int, ArticleORM]] = []
        included_years: set[int] = set()

        threshold = max(int(min_citations or 0), int(percentile_threshold or 0))

        # First pass: include only years where top article meets threshold
        for y in sorted_years:
            if len(pairs) >= years:
                break
            candidates = by_year[y]
            # choose article with max citation_count
            best = max(candidates, key=lambda art: int(art.citation_count or 0))
            best_count = int(best.citation_count or 0)
            if best_count >= threshold:
                pairs.append((y, best))
                included_years.add(y)

        # If we don't have enough, fill remaining slots with best articles from recent years
        if len(pairs) < years:
            for y in sorted_years:
                if len(pairs) >= years:
                    break
                if y in included_years:
                    continue
                candidates = by_year[y]
                best = max(candidates, key=lambda art: int(art.citation_count or 0))
                pairs.append((y, best))
                included_years.add(y)

        # Finally, return up to `years` pairs (may be fewer if not enough years exist)
        return pairs[:years]
