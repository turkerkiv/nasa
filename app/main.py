from fastapi import FastAPI
from app.routers import articles
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="FastAPI Vector + ML Project")


# Add routers
app.include_router(articles.router)


@app.get("/")
def root():
    return {"message": "Hello FastAPI"}
