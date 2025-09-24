import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load env vars
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("❌ DATABASE_URL not set in environment variables")

# Detect Supabase session pooler
IS_POOLER = "pooler.supabase.com" in DATABASE_URL

if IS_POOLER:
    # Force disable prepared statements at the URL level
    if "?" in DATABASE_URL:
        DATABASE_URL += "&prepared_statement_cache_size=0"
    else:
        DATABASE_URL += "?prepared_statement_cache_size=0"

# Engine config
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # True for debugging
    future=True,
    pool_size=5 if IS_POOLER else 10,    # small for pooler, bigger for direct DB
    max_overflow=10 if IS_POOLER else 20,
    pool_pre_ping=True,
    pool_recycle=280,  # recycle connections every ~5 minutes
    connect_args=(
        {"prepared_statement_cache_size": 0, "prepared_statement_name_func": None}
        if IS_POOLER else {}
    ),
)

# Session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

# Base model
Base = declarative_base()

# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Startup
async def connect_to_postgres():
    try:
        async with engine.begin() as conn:
            # Create tables if they don’t exist
            await conn.run_sync(Base.metadata.create_all)

            from sqlalchemy import text
            result = await conn.execute(text("SELECT 1"))
            row = result.fetchone()
            print(f"✅ PostgreSQL connected successfully (test result: {row[0]})")

            env_type = "Supabase Pooler" if IS_POOLER else "Direct/Postgres"
            print(f"🔗 Using connection: {env_type}")
    except Exception as e:
        print(f"❌ PostgreSQL connection failed: {e}")
        raise

# Shutdown
async def close_postgres_connection():
    await engine.dispose()
    print("🔌 PostgreSQL connection closed")
