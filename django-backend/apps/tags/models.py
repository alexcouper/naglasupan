import uuid
from django.db import models
from django.core.validators import RegexValidator


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True, db_index=True)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    color = models.CharField(
        max_length=7, 
        blank=True, 
        null=True,
        validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$', 'Enter a valid hex color.')],
        help_text="Hex color code (e.g., #FF5733)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tags'
        ordering = ['name']

    def __str__(self):
        return self.name
