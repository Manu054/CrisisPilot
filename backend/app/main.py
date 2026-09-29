"""Main FastAPI Application Entrypoint for CrisisPilot.
"Turn Sales Challenges Into Smart Decisions"
"""
import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import AppException
from app.db.database import init_db
from app.integrations.hindsight import hindsight_client

# Route imports
from app.api.routes.auth import router as auth_router
from app.api.routes.organizations import router as org_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.crises import router as crises_router
from app.api.routes.decisions import router as decisions_router
from app.api.routes.simulations import router as simulations_router
from app.api.routes.inventory import router as inventory_router
from app.api.routes.memory import router as memory_router
from app.api.routes.insights import router as insights_router
from app.api.routes.recommendations import router as recommendations_router
from app.api.routes.reports import router as reports_router
from app.api.routes.ai import router as ai_router
from app.api.routes.notifications import router as notifications_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for initialization and graceful teardown."""
    logger.info("Initializing CrisisPilot Backend application...")
    # Initialize DB tables (creates tables if development / SQLite)
    await init_db()
    logger.info(f"CrisisPilot ready in '{settings.environment}' mode on port {settings.port}")
    yield
    logger.info("Shutting down CrisisPilot Backend...")


app = FastAPI(
    title="CrisisPilot API",
    description=(
        "Production-quality backend for CrisisPilot — an AI-powered business decision-intelligence "
        "platform powered by HindSight organizational memory and deterministic financial simulations."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    """Track request ID, processing time, and structured JSON logs."""
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.perf_counter()

    try:
        response = await call_next(request)
        process_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-Ms"] = str(process_time_ms)
        
        # Don't clutter logs with healthchecks
        if not request.url.path.startswith("/health"):
            logger.info(
                f"{request.method} {request.url.path} -> {response.status_code} ({process_time_ms}ms)"
            )
        return response
    except Exception as exc:
        process_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.error(
            f"Unhandled server error on {request.method} {request.url.path} after {process_time_ms}ms: {exc}",
            exc_info=True,
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected internal server error occurred.",
                    "request_id": request_id,
                }
            },
            headers={"X-Request-ID": request_id},
        )


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions cleanly."""
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "request_id": request_id,
                "details": exc.details,
            }
        },
        headers={"X-Request-ID": request_id},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle standard Pydantic schema validation failures."""
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request parameters or payload.",
                "request_id": request_id,
                "details": exc.errors(),
            }
        },
        headers={"X-Request-ID": request_id},
    )


# Health and Observability Endpoints
@app.get("/health", tags=["Observability"])
async def health_check():
    """System liveness check reporting subsystem statuses."""
    hs_status = "connected" if hindsight_client.is_available() else "fallback_mode"
    return {
        "status": "healthy",
        "service": "crisispilot-backend",
        "database": "connected",
        "hindsight": hs_status,
        "environment": settings.environment,
    }


@app.get("/health/ready", tags=["Observability"])
async def ready_check():
    """Readiness probe for Kubernetes or Docker orchestrators."""
    return {"status": "ready"}


@app.get("/", tags=["Root"])
async def root():
    """Root info endpoint."""
    return {
        "app": "CrisisPilot API",
        "tagline": "Turn Sales Challenges Into Smart Decisions",
        "version": "1.0.0",
        "documentation": "/docs",
    }


# Include all modular routers under /api
api_prefix = "/api"
app.include_router(auth_router, prefix=api_prefix)
app.include_router(org_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)
app.include_router(crises_router, prefix=api_prefix)
app.include_router(decisions_router, prefix=api_prefix)
app.include_router(simulations_router, prefix=api_prefix)
app.include_router(inventory_router, prefix=api_prefix)
app.include_router(memory_router, prefix=api_prefix)
app.include_router(insights_router, prefix=api_prefix)
app.include_router(recommendations_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)
app.include_router(ai_router, prefix=api_prefix)
app.include_router(notifications_router, prefix=api_prefix)
