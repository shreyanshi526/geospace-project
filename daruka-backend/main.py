from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.integration.db.postgres import close_postgres_connection, connect_to_postgres

# Import routers
from app.modules.project.routes.projectRouter import router as projects_router
from app.modules.sites.routes.siteRouter import router as sites_router
from app.modules.users.routes.userRouter import router as users_router

app = FastAPI()


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

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with PostgreSQL is running!"}
