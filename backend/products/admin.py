
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import ProductType, WeatherProduct, ProductCollection


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'color_preview', 'product_count', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('code', 'name', 'description')
    prepopulated_fields = {'code': ('name',)}
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 20px; height: 20px; background-color: {}; border: 1px solid #ccc; border-radius: 3px;"></div>',
            obj.color
        )
    color_preview.short_description = 'Color'
    
    def product_count(self, obj):
        count = obj.products.count()
        if count > 0:
            url = reverse('admin:products_weatherproduct_changelist') + f'?product_type__id={obj.id}'
            return format_html('<a href="{}">{} productos</a>', url, count)
        return '0 productos'
    product_count.short_description = 'Productos'


@admin.register(WeatherProduct)
class WeatherProductAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'product_type', 'generated_at', 'file_format', 
        'file_size_mb', 'is_available', 'age_display', 'preview_link'
    )
    list_filter = (
        'product_type', 'file_format', 'is_available', 
        'generated_at', 'created_at'
    )
    search_fields = ('title', 'filename', 'description', 'region')
    readonly_fields = ('created_at', 'updated_at', 'last_checked', 'age_hours', 'file_size_mb')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'product_type', 'description')
        }),
        ('Archivo', {
            'fields': ('filename', 'file_url', 'file_format', 'file_size', 'file_size_mb')
        }),
        ('Información Temporal', {
            'fields': ('generated_at', 'valid_from', 'valid_until', 'age_hours')
        }),
        ('Metadatos', {
            'fields': ('region', 'resolution')
        }),
        ('Estado', {
            'fields': ('is_available', 'last_checked')
        }),
        ('Sistema', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    date_hierarchy = 'generated_at'
    
    def file_size_mb(self, obj):
        if obj.file_size:
            return f"{obj.file_size / (1024*1024):.2f} MB"
        return "N/A"
    file_size_mb.short_description = 'Tamaño'
    
    def age_display(self, obj):
        hours = obj.age_hours
        if hours < 24:
            return f"{hours}h"
        else:
            days = int(hours // 24)
            remaining_hours = int(hours % 24)
            return f"{days}d {remaining_hours}h"
    age_display.short_description = 'Antigüedad'
    
    def preview_link(self, obj):
        if obj.file_url and obj.is_available:
            return format_html(
                '<a href="{}" target="_blank">Ver</a>',
                obj.file_url
            )
        return "N/A"
    preview_link.short_description = 'Vista previa'

    actions = ['mark_as_available', 'mark_as_unavailable', 'update_file_info']
    
    def mark_as_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} productos marcados como disponibles.')
    mark_as_available.short_description = 'Marcar como disponible'
    
    def mark_as_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} productos marcados como no disponibles.')
    mark_as_unavailable.short_description = 'Marcar como no disponible'


@admin.register(ProductCollection)
class ProductCollectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_type', 'product_count', 'is_animation', 'animation_speed', 'latest_product_date')
    list_filter = ('product_type', 'is_animation', 'created_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('products',)
    
    def latest_product_date(self, obj):
        date = obj.latest_product_date
        if date:
            return date.strftime('%Y-%m-%d %H:%M')
        return "N/A"
    latest_product_date.short_description = 'Último producto'


# Customize admin site
admin.site.site_header = "OHMC Weather Admin"
admin.site.site_title = "OHMC Weather"
admin.site.index_title = "Panel de administración"
