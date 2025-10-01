import uuid
from django.db import models
from django.conf import settings
from apps.tags.models import Tag


class ProjectStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    APPROVED = "approved", "Approved"
    REJECTED = "rejected", "Rejected"


class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100, db_index=True)
    description = models.TextField(max_length=500)
    long_description = models.TextField(max_length=5000, blank=True, null=True)
    website_url = models.URLField(max_length=2083)
    github_url = models.URLField(max_length=2083, blank=True, null=True)
    demo_url = models.URLField(max_length=2083, blank=True, null=True)
    screenshot_urls = models.JSONField(default=list, blank=True)
    tech_stack = models.JSONField(default=list)
    monthly_visitors = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=20, 
        choices=ProjectStatus.choices, 
        default=ProjectStatus.PENDING,
        db_index=True
    )
    rejection_reason = models.TextField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    submission_month = models.CharField(max_length=7, db_index=True)  # YYYY-MM format
    approved_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Foreign Keys
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='projects'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='approved_projects'
    )
    
    # Many-to-Many
    tags = models.ManyToManyField(Tag, related_name='projects', blank=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.submission_month:
            from datetime import datetime
            self.submission_month = datetime.now().strftime('%Y-%m')
        super().save(*args, **kwargs)


class ProjectView(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='views')
    viewer_ip = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'project_views'
        unique_together = ['project', 'viewer_ip']
