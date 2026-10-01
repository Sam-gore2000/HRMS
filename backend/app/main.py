from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import attendance, auth, dashboard, resources
from app.roles.admin.routes import router as admin_router
from app.roles.employee.routes import router as employee_router
from app.roles.manager.routes import router as manager_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin, "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router, prefix=settings.api_prefix)
    app.include_router(dashboard.router, prefix=settings.api_prefix)
    app.include_router(attendance.router, prefix=settings.api_prefix)
    app.include_router(resources.router, prefix=settings.api_prefix)
    app.include_router(admin_router, prefix=f"{settings.api_prefix}/admin")
    app.include_router(manager_router, prefix=f"{settings.api_prefix}/manager")
    app.include_router(employee_router, prefix=f"{settings.api_prefix}/employee")

    @app.get("/health")
    def health_check():
        return {"status": "ok", "app": settings.app_name}

    return app


app = create_app()
