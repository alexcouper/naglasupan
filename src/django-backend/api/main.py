from ninja import NinjaAPI
from api.routers import auth, projects, my_projects, tags, admin

api = NinjaAPI(
    title="Project Showcase API",
    description="API for developer project showcasing platform",
    version="1.0.0"
)

# Add routers
api.add_router("/auth", auth.router)
api.add_router("/projects", projects.router)
api.add_router("/my/projects", my_projects.router)
api.add_router("/tags", tags.router)
api.add_router("/admin", admin.router)


@api.get("/")
def root(request):
    return {"message": "Project Showcase API"}


@api.get("/health")
def health_check(request):
    return {"status": "healthy"}