from django.contrib import admin
from django.utils.html import format_html
from .models import Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'color_display', 'project_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'slug', 'description')
    ordering = ('name',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Tag Information', {
            'fields': ('name', 'slug', 'description', 'color')
        }),
        ('System', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def color_display(self, obj):
        if obj.color:
            return format_html(
                '<span style="background-color: {}; color: white; padding: 2px 6px; border-radius: 3px;">{}</span>',
                obj.color,
                obj.color
            )
        return '-'
    color_display.short_description = 'Color'
    
    def project_count(self, obj):
        return obj.projects.count()
    project_count.short_description = 'Projects'
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('projects')
