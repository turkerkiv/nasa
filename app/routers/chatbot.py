from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import services, database
from app.schemas import ChatRequest

router = APIRouter(prefix="/articles/chatbot", tags=["chatbot"])


async def get_service(db: AsyncSession = Depends(database.get_db)):
    return services.ChatService(db)


@router.post("/", response_model=dict)
async def chat_with_article(
    req: ChatRequest, service: services.ChatService = Depends(get_service)
):
    try:
        reply = await service.chat(req.article_id, req.message)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

    return {"reply": reply}
