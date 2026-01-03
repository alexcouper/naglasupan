from __future__ import annotations

from typing import TYPE_CHECKING

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html

from .models import Project, ProjectStatus, ProjectView

if TYPE_CHECKING:
    from django.utils.safestring import SafeString


class ProjectViewInline(admin.TabularInline):
    model = ProjectView
    extra = 0
    readonly_fields = ("viewer_ip", "user_agent", "created_at")
    can_delete = False

    def has_add_permission(
        self,
        request: HttpRequest,
        obj: Project | None = None,
    ) -> bool:
        return False


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "owner_link",
        "status",
        "is_featured",
        "monthly_visitors",
        "view_count",
        "submission_month",
        "created_at",
    )
    list_filter = ("status", "is_featured", "submission_month", "created_at", "tags")
    search_fields = ("title", "description", "owner__email", "owner__username")
    ordering = ("-created_at",)
    readonly_fields = ("id", "view_count", "created_at", "updated_at", "approved_at")
    filter_horizontal = ("tags",)
    inlines = [ProjectViewInline]

    fieldsets = (
        (
            "Project Information",
            {
                "fields": (
                    "title",
                    "description",
                    "long_description",
                    "tech_stack",
                    "tags",
                ),
            },
        ),
        (
            "URLs",
            {"fields": ("website_url", "github_url", "demo_url", "screenshot_urls")},
        ),
        (
            "Status & Approval",
            {
                "fields": (
                    "status",
                    "rejection_reason",
                    "approved_by",
                    "approved_at",
                    "is_featured",
                ),
            },
        ),
        ("Metrics", {"fields": ("monthly_visitors", "view_count", "submission_month")}),
        ("Ownership", {"fields": ("owner",)}),
        (
            "System",
            {"fields": ("id", "created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    @admin.display(description="Owner", ordering="owner__email")
    def owner_link(self, obj: Project) -> SafeString | str:
        if obj.owner:
            url = reverse("admin:users_user_change", args=[obj.owner.pk])
            return format_html('<a href="{}">{}</a>', url, obj.owner.email)
        return "-"

    @admin.display(description="Total Views")
    def view_count(self, obj: Project) -> int:
        return obj.views.count()

    def get_queryset(self, request: HttpRequest) -> QuerySet[Project]:
        return (
            super()
            .get_queryset(request)
            .select_related("owner", "approved_by")
            .prefetch_related("tags", "views")
        )

    actions = [
        "approve_projects",
        "reject_projects",
        "feature_projects",
        "unfeature_projects",
    ]

    @admin.action(description="Approve selected projects")
    def approve_projects(
        self,
        request: HttpRequest,
        queryset: QuerySet[Project],
    ) -> None:
        updated = queryset.filter(status=ProjectStatus.PENDING).update(
            status=ProjectStatus.APPROVED,
            approved_by=request.user,
            approved_at=timezone.now(),
        )
        self.message_user(request, f"{updated} projects were approved.")

    @admin.action(description="Reject selected projects")
    def reject_projects(
        self,
        request: HttpRequest,
        queryset: QuerySet[Project],
    ) -> None:
        updated = queryset.filter(status=ProjectStatus.PENDING).update(
            status=ProjectStatus.REJECTED,
            approved_by=request.user,
        )
        self.message_user(request, f"{updated} projects were rejected.")

    @admin.action(description="Feature selected projects")
    def feature_projects(
        self,
        request: HttpRequest,
        queryset: QuerySet[Project],
    ) -> None:
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} projects were featured.")

    @admin.action(description="Unfeature selected projects")
    def unfeature_projects(
        self,
        request: HttpRequest,
        queryset: QuerySet[Project],
    ) -> None:
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"{updated} projects were unfeatured.")


@admin.register(ProjectView)
class ProjectViewAdmin(admin.ModelAdmin):
    list_display = ("project_link", "viewer_ip", "created_at")
    list_filter = ("created_at",)
    search_fields = ("project__title", "viewer_ip")
    readonly_fields = ("id", "project", "viewer_ip", "user_agent", "created_at")
    ordering = ("-created_at",)

    @admin.display(description="Project", ordering="project__title")
    def project_link(self, obj: ProjectView) -> SafeString | str:
        if obj.project:
            url = reverse("admin:projects_project_change", args=[obj.project.pk])
            return format_html('<a href="{}">{}</a>', url, obj.project.title)
        return "-"

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(
        self,
        request: HttpRequest,
        obj: ProjectView | None = None,
    ) -> bool:
        return False
