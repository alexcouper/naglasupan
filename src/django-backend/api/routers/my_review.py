from django.http import HttpRequest
from ninja import Router

from api.auth.security import auth
from api.schemas.errors import Error
from api.schemas.my_review import (
    ReviewCompetitionDetailResponse,
    ReviewCompetitionListResponse,
    ReviewProjectResponse,
)
from apps.projects.models import Competition, CompetitionReviewer, ProjectRanking

router = Router()


@router.get(
    "/competitions",
    response={200: ReviewCompetitionListResponse},
    auth=auth,
    tags=["My Review"],
)
def list_my_review_competitions(request: HttpRequest) -> dict:
    """List all competitions the current user is assigned to review."""
    assignments = CompetitionReviewer.objects.filter(
        user=request.auth
    ).select_related("competition")

    competitions = [a.competition for a in assignments]
    return {"competitions": competitions}


@router.get(
    "/competitions/{competition_id}",
    response={200: ReviewCompetitionDetailResponse, 404: Error},
    auth=auth,
    tags=["My Review"],
)
def get_my_review_competition(
    request: HttpRequest,
    competition_id: str,
) -> dict | tuple[int, dict[str, str]]:
    """Get competition details with projects and reviewer's rankings."""
    # Check that user is assigned to this competition
    assignment = CompetitionReviewer.objects.filter(
        user=request.auth,
        competition_id=competition_id,
    ).first()

    if not assignment:
        return 404, {"detail": "Competition not found"}

    competition = Competition.objects.prefetch_related(
        "projects",
        "projects__images",
    ).get(id=competition_id)

    # Get user's rankings for this competition
    rankings = {
        r.project_id: r.position
        for r in ProjectRanking.objects.filter(
            reviewer=request.auth,
            competition=competition,
        )
    }

    # Build response with ranking info
    projects = []
    for project in competition.projects.all():
        project_data = ReviewProjectResponse.from_orm(project).dict()
        project_data["my_ranking"] = rankings.get(project.id)
        projects.append(project_data)

    return {
        "id": competition.id,
        "name": competition.name,
        "start_date": competition.start_date,
        "end_date": competition.end_date,
        "projects": projects,
    }
