from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import user_routes, prediction_routes, chatbot_routes, gamification_routes, mood_routes
from services.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("Database initialized successfully!")
    yield
    print("Shutting down...")


# ✅ CREATE APP FIRST
app = FastAPI(
    title="BurnAware API",
    description="Burnout Prediction and Prevention Application",
    version="1.0.0",
    lifespan=lifespan
)


# ✅ THEN ADD CORS (IMPORTANT ORDER)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# routers
app.include_router(user_routes.router, prefix="/api/users", tags=["users"])
app.include_router(prediction_routes.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(chatbot_routes.router, prefix="/api/chatbot", tags=["chatbot"])
app.include_router(gamification_routes.router, prefix="/api/gamification", tags=["gamification"])
app.include_router(mood_routes.router, prefix="/api/mood", tags=["mood"])
