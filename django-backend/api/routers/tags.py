from ninja import Router
from typing import List
from apps.tags.models import Tag
from api.schemas.tag import TagResponse

router = Router()


@router.get("", response=List[TagResponse], tags=["Tags"])
def list_tags(request):
    tags = Tag.objects.all()
    return tags