from datetime import date
from typing import Any
from uuid import UUID

from ninja import Schema

from apps.projects.models import ProjectStatus


class CompetitionProjectResponse(Schema):
    id: UUID
    title: str
    main_image_url: str | None = None

    @staticmethod
    def resolve_main_image_url(obj: Any) -> str | None:
        main_image = obj.images.filter(upload_status="uploaded", is_main=True).first()
        if not main_image:
            main_image = obj.images.filter(upload_status="uploaded").first()
        return main_image.url if main_image else None


class CompetitionResponse(Schema):
    id: UUID
    name: str
    start_date: date
    end_date: date
    projects: list[CompetitionProjectResponse]

    @staticmethod
    def resolve_projects(obj: Any) -> list[Any]:
        return list(
            obj.projects.filter(status=ProjectStatus.APPROVED).prefetch_related(
                "images"
            )
        )


class CompetitionListResponse(Schema):
    competitions: list[CompetitionResponse]
