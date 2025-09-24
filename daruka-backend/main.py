from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.integration.db.postgres import close_postgres_connection, connect_to_postgres
from app.modules.project.routes.projectRouter import router as projects_router
from app.modules.sites.routes.siteRouter import router as sites_router
from app.modules.users.routes.userRouter import router as users_router

app = FastAPI()

raw_origins = os.getenv("CORS_ORIGIN", "*")

if raw_origins == "*":
    allow_origins = ["*"]
else:
    allow_origins = [origin.strip() for origin in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup & shutdown events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_postgres()


@app.on_event("shutdown")
async def shutdown_db_client():
    await close_postgres_connection()


# Register routers
app.include_router(projects_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(sites_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with PostgreSQL is running!"}
