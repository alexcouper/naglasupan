from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest
from django.utils.html import format_html

from .models import Tag

if TYPE_CHECKING:
    from django.utils.safestring import SafeString


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "color_display", "project_count", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "slug", "description")
    ordering = ("name",)
    readonly_fields = ("id", "created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}

    fieldsets = (
        ("Tag Information", {"fields": ("name", "slug", "description", "color")}),
        (
            "System",
            {"fields": ("id", "created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    @admin.display(description="Color")
    def color_display(self, obj: Tag) -> SafeString | str:
        if obj.color:
            return format_html(
                '<span style="background-color: {}; color: white; '
                'padding: 2px 6px; border-radius: 3px;">{}</span>',
                obj.color,
                obj.color,
            )
        return "-"

    @admin.display(description="Projects")
    def project_count(self, obj: Tag) -> int:
        return obj.projects.count()

    def get_queryset(self, request: HttpRequest) -> QuerySet[Tag]:
        return super().get_queryset(request).prefetch_related("projects")
