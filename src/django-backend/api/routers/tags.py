from django.db.models import QuerySet
from django.http import HttpRequest
from ninja import Router

from api.schemas.tag import TagResponse
from apps.tags.models import Tag

router = Router()


@router.get("", response={200: list[TagResponse]}, tags=["Tags"])
def list_tags(request: HttpRequest) -> QuerySet[Tag]:
    return Tag.objects.all()
