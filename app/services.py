from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import ArticleRepository
from app.schemas import ArticleListItem, PaginatedArticles
from app.schemas import ArticleBase
from pathlib import Path
import asyncio


class ChatService:
    def __init__(self, db: AsyncSession):
        # reuse repository to fetch article metadata
        self.articleRepo = ArticleRepository(db)

    async def chat(self, article_id: int, message: str) -> str:
        # fetch raw article ORM object
        article = await self.articleRepo.get_by_id(article_id)
        if article is None:
            raise ValueError("Article not found")

        file_name = article.file_name
        if not file_name:
            raise ValueError("Article has no associated PDF file")

        # locate pdf_storage at project root (app/ -> parent)
        base = Path(__file__).resolve().parents[1].joinpath("pdf_storage").resolve()
        requested = (base / file_name).resolve()

        if not str(requested).startswith(str(base)):
            raise ValueError("Invalid filename")
        if not requested.exists() or not requested.is_file():
            raise FileNotFoundError("PDF file not found")

        # extract text lazily
        try:
            import PyPDF2
        except Exception:
            raise RuntimeError(
                "Missing dependency: PyPDF2. Install with pip install PyPDF2"
            )

        try:
            text_chunks = []
            with open(requested, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    try:
                        text = page.extract_text() or ""
                    except Exception:
                        text = ""
                    if text:
                        text_chunks.append(text)
            full_text = "\n".join(text_chunks)
        except Exception as e:
            raise RuntimeError(f"Failed to read PDF: {e}")

        # api_key = os.environ.get("GEMINI_API_KEY")
        # if not api_key:
        #     raise RuntimeError("GEMINI_API_KEY environment variable not set")
        api_key = "AIzaSyAovndSW-zxvmLzX4iI6eeLVLeiw8Cbkb0"

        try:
            from google import genai
        except Exception:
            raise RuntimeError(
                "Missing dependency: google-genai SDK. Install with pip install google-genai"
            )

        MODEL_NAME = "gemini-2.5-flash"

        article_preview = full_text[:20000]
        history = [
            {
                "role": "user",
                "parts": [
                    {"text": f"Article content:\n{article_preview}"},
                    {"text": f"User message:\n{message}"},
                ],
            }
        ]

        def call_gemini():
            client = genai.Client(api_key=api_key)
            chat = client.chats.create(model=MODEL_NAME, history=history)
            resp = chat.send_message(message)
            return resp.text

        loop = asyncio.get_running_loop()
        reply = await loop.run_in_executor(None, call_gemini)
        return reply


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
