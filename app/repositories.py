from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.orm_models import ArticleORM
from sqlalchemy.orm import joinedload


class ArticleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_pill_info_by_article(self, article_id: int):
        """
        Return the ArticlePillInfoORM object associated with the given article_id
        or None if not found.
        """
        from app.orm_models import ArticlePillInfoORM

        result = await self.db.execute(
            select(ArticlePillInfoORM).where(
                ArticlePillInfoORM.article_id == article_id
            )
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        limit: int | None = None,
        offset: int | None = None,
        search: str | None = None,
        keyword: str | None = None,
    ):
        """
        Return items and total count, supports optional `search` (title/abstract)
        and `keyword` filter (substring match against ArticleORM.keywords).
        """
        # build base query with filters
        base_query = select(ArticleORM)

        if search is not None:
            base_query = base_query.where(
                ArticleORM.title.ilike(f"%{search}%")
                | ArticleORM.abstract.ilike(f"%{search}%")
            )

        if keyword is not None:
            # simple substring match; keywords are stored as comma/semicolon separated string
            base_query = base_query.where(ArticleORM.keywords.ilike(f"%{keyword}%"))

        # compute total before applying limit/offset
        total_result = await self.db.execute(base_query)
        total = len(total_result.scalars().all())

        query = base_query
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

    async def get_similar_articles(
        self, article_id: int, limit: int = 3
    ) -> list[ArticleORM]:
        """
        Return up to `limit` articles similar to the article with id `article_id`.
        Similarity is defined by shared keywords (ArticleORM.keywords string).
        If there are fewer than `limit` similar articles, fill the remainder with random
        articles (excluding the original), appended at the end.
        """
        # fetch target article
        target = await self.get_by_id(article_id)
        if target is None:
            return []

        def parse_keywords(kws: str) -> set[str]:
            if not kws:
                return set()
            parts = []
            for part in kws.split(","):
                subparts = part.split(";") if ";" in part else [part]
                parts.extend(subparts)
            return {p.strip().lower() for p in parts if p and p.strip()}

        target_kws = parse_keywords(target.keywords or "")

        # fetch other articles
        result = await self.db.execute(select(ArticleORM))
        items = result.scalars().all()

        others = [a for a in items if a.id != article_id]

        similar_scores: list[tuple[int, ArticleORM]] = []
        for a in others:
            kws = parse_keywords(a.keywords or "")
            shared = len(target_kws.intersection(kws)) if target_kws else 0
            if shared > 0:
                # score primarily by shared count, tiebreaker by citation_count
                score = (shared, int(a.citation_count or 0))
                similar_scores.append((score, a))

        # sort by shared desc then citation_count desc
        similar_scores.sort(key=lambda x: (x[0][0], x[0][1]), reverse=True)
        similar_articles = [a for _, a in similar_scores]

        # If not enough similar, pick random fillers (append at end)
        import random

        fillers: list[ArticleORM] = []
        if len(similar_articles) < limit:
            remaining_pool = [a for a in others if a not in similar_articles]
            random.shuffle(remaining_pool)
            need = limit - len(similar_articles)
            fillers = remaining_pool[:need]

        combined = similar_articles[:limit] + fillers
        # ensure no more than limit
        return combined[:limit]

    async def get_random(self, limit: int = 10):
        """
        Return a random selection of articles up to `limit` and the total count of articles.
        This method fetches all article IDs, samples up to `limit`, then returns the
        matching ArticleORM objects in the sampled order.
        """
        result = await self.db.execute(select(ArticleORM))
        items = result.scalars().all()
        total = len(items)

        if total == 0:
            return [], 0

        import random

        # shuffle a copy to avoid mutating original
        pool = items.copy()
        random.shuffle(pool)
        sampled = pool[:limit]
        return sampled, total
