from django.http import HttpRequest
from ninja import Router

from api.auth.security import auth
from api.schemas.errors import Error
from api.schemas.my_review import (
    RankingUpdateRequest,
    ReviewCompetitionDetailResponse,
    ReviewCompetitionListResponse,
    ReviewProjectResponse,
    StatusUpdateRequest,
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
    assignments = CompetitionReviewer.objects.filter(user=request.auth).select_related(
        "competition"
    )

    competitions = []
    for assignment in assignments:
        comp = assignment.competition
        competitions.append(
            {
                "id": comp.id,
                "name": comp.name,
                "start_date": comp.start_date,
                "end_date": comp.end_date,
                "project_count": comp.projects.count(),
                "my_review_status": assignment.status,
            }
        )
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
        "my_review_status": assignment.status,
        "projects": projects,
    }


@router.put(
    "/competitions/{competition_id}/rankings",
    response={200: ReviewCompetitionDetailResponse, 400: Error, 404: Error},
    auth=auth,
    tags=["My Review"],
)
def update_rankings(
    request: HttpRequest,
    competition_id: str,
    payload: RankingUpdateRequest,
) -> dict | tuple[int, dict[str, str]]:
    """Update rankings for projects in a competition."""
    # Check that user is assigned to this competition
    assignment = CompetitionReviewer.objects.filter(
        user=request.auth,
        competition_id=competition_id,
    ).first()

    if not assignment:
        return 404, {"detail": "Competition not found"}

    competition = Competition.objects.prefetch_related("projects").get(
        id=competition_id
    )

    # Validate all project_ids belong to this competition
    competition_project_ids = set(competition.projects.values_list("id", flat=True))
    submitted_project_ids = set(payload.project_ids)

    invalid_ids = submitted_project_ids - competition_project_ids
    if invalid_ids:
        return 400, {"detail": "One or more projects do not belong to this competition"}

    # Delete existing rankings for this reviewer/competition
    ProjectRanking.objects.filter(
        reviewer=request.auth,
        competition=competition,
    ).delete()

    # Create new rankings
    rankings_to_create = [
        ProjectRanking(
            reviewer=request.auth,
            competition=competition,
            project_id=project_id,
            position=position,
        )
        for position, project_id in enumerate(payload.project_ids, start=1)
    ]
    ProjectRanking.objects.bulk_create(rankings_to_create)

    # Return updated competition detail
    rankings = {r.project_id: r.position for r in rankings_to_create}

    projects = []
    for project in competition.projects.prefetch_related("images").all():
        project_data = ReviewProjectResponse.from_orm(project).dict()
        project_data["my_ranking"] = rankings.get(project.id)
        projects.append(project_data)

    return {
        "id": competition.id,
        "name": competition.name,
        "start_date": competition.start_date,
        "end_date": competition.end_date,
        "my_review_status": assignment.status,
        "projects": projects,
    }


@router.put(
    "/competitions/{competition_id}/status",
    response={200: ReviewCompetitionDetailResponse, 404: Error},
    auth=auth,
    tags=["My Review"],
)
def update_review_status(
    request: HttpRequest,
    competition_id: str,
    payload: StatusUpdateRequest,
) -> dict | tuple[int, dict[str, str]]:
    """Update the reviewer's status for a competition."""
    assignment = CompetitionReviewer.objects.filter(
        user=request.auth,
        competition_id=competition_id,
    ).first()

    if not assignment:
        return 404, {"detail": "Competition not found"}

    assignment.status = payload.status.value
    assignment.save()

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
        "my_review_status": assignment.status,
        "projects": projects,
    }
