import asyncio
from database import engine, Base
from orm_models import ArticleORM, AuthorORM, ArticleAuthorORM

print("Kayıtlı tablolar:", Base.metadata.tables.keys())


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


asyncio.run(init_db())
