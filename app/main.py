from fastapi import FastAPI
from app.routers import articles, chatbot
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="FastAPI Vector + ML Project")


# Add routers
app.include_router(articles.router)
app.include_router(chatbot.router)

origins = [
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello FastAPI"}
