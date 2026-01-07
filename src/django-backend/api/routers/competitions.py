from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import Router

from api.schemas.competition import CompetitionListResponse, CompetitionResponse
from api.schemas.errors import Error
from apps.projects.models import Competition

router = Router()


@router.get("", response={200: CompetitionListResponse}, tags=["Competitions"])
def list_competitions(request: HttpRequest) -> dict:
    competitions = Competition.objects.prefetch_related(
        "projects",
        "projects__images",
    ).all()
    return {"competitions": competitions}


@router.get(
    "/{competition_id}",
    response={200: CompetitionResponse, 404: Error},
    tags=["Competitions"],
)
def get_competition(
    request: HttpRequest, competition_id: str
) -> Competition | tuple[int, dict]:
    return get_object_or_404(
        Competition.objects.prefetch_related(
            "projects",
            "projects__images",
        ),
        id=competition_id,
    )
