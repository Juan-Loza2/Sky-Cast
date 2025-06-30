from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Count, Q
from django.utils import timezone
from django.http import JsonResponse
from django.urls import path
from django.shortcuts import render
from django.contrib.admin import SimpleListFilter
from datetime import datetime, timedelta
import json
from .models import ProductType, WeatherProduct, ProductCollection


class ProductTypeFilter(SimpleListFilter):
    title = 'Tipo de Producto'
    parameter_name = 'product_type_filter'

    def lookups(self, request, model_admin):
        types = ProductType.objects.filter(is_active=True).annotate(
            product_count=Count('products')
        ).filter(product_count__gt=0)
        return [(t.id, f"{t.name} ({t.product_count})") for t in types]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(product_type_id=self.value())


class DateRangeFilter(SimpleListFilter):
    title = 'Rango de Fechas'
    parameter_name = 'date_range'

    def lookups(self, request, model_admin):
        return (
            ('today', 'Hoy'),
            ('yesterday', 'Ayer'),
            ('week', 'Última semana'),
            ('month', 'Último mes'),
            ('older', 'Más antiguo'),
        )

    def queryset(self, request, queryset):
        now = timezone.now()
        if self.value() == 'today':
            return queryset.filter(generated_at__date=now.date())
        elif self.value() == 'yesterday':
            yesterday = now.date() - timedelta(days=1)
            return queryset.filter(generated_at__date=yesterday)
        elif self.value() == 'week':
            week_ago = now - timedelta(days=7)
            return queryset.filter(generated_at__gte=week_ago)
        elif self.value() == 'month':
            month_ago = now - timedelta(days=30)
            return queryset.filter(generated_at__gte=month_ago)
        elif self.value() == 'older':
            month_ago = now - timedelta(days=30)
            return queryset.filter(generated_at__lt=month_ago)


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = (
        'code', 'name', 'color_preview', 'product_count', 
        'recent_products', 'is_active', 'created_at'
    )
    list_filter = ('is_active', 'created_at')
    search_fields = ('code', 'name', 'description')
    prepopulated_fields = {'code': ('name',)}
    readonly_fields = ('product_count_display', 'recent_products_display')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('code', 'name', 'description', 'color')
        }),
        ('Estadísticas', {
            'fields': ('product_count_display', 'recent_products_display'),
            'classes': ('collapse',)
        }),
        ('Estado', {
            'fields': ('is_active',)
        })
    )
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 30px; height: 20px; background-color: {}; border: 1px solid #ccc; border-radius: 4px; display: inline-block; margin-right: 8px;"></div>{}',
            obj.color, obj.color
        )
    color_preview.short_description = 'Color'
    
    def product_count(self, obj):
        count = obj.products.count()
        if count > 0:
            url = reverse('admin:products_weatherproduct_changelist') + f'?product_type__id={obj.id}'
            return format_html(
                '<a href="{}" style="color: #007bff; text-decoration: none; font-weight: bold;">{} productos</a>',
                url, count
            )
        return format_html('<span style="color: #6c757d;">0 productos</span>')
    product_count.short_description = 'Total Productos'
    
    def recent_products(self, obj):
        recent = obj.products.filter(
            generated_at__gte=timezone.now() - timedelta(hours=24)
        ).count()
        if recent > 0:
            return format_html(
                '<span style="color: #28a745; font-weight: bold;">{} recientes</span>',
                recent
            )
        return format_html('<span style="color: #6c757d;">0 recientes</span>')
    recent_products.short_description = 'Últimas 24h'
    
    def product_count_display(self, obj):
        count = obj.products.count()
        return f"{count} productos totales"
    product_count_display.short_description = 'Total de productos'
    
    def recent_products_display(self, obj):
        recent = obj.products.filter(
            generated_at__gte=timezone.now() - timedelta(hours=24)
        ).count()
        return f"{recent} productos en las últimas 24 horas"
    recent_products_display.short_description = 'Productos recientes'


@admin.register(WeatherProduct)
class WeatherProductAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'product_type_colored', 'generated_at', 'file_format_badge', 
        'file_size_mb', 'is_available_badge', 'age_display', 'preview_link'
    )
    list_filter = (
        ProductTypeFilter, DateRangeFilter,
        'file_format', 'is_available', 'generated_at', 'created_at'
    )
    search_fields = ('title', 'filename', 'description', 'region')
    readonly_fields = (
        'created_at', 'updated_at', 'last_checked', 'age_hours', 
        'file_size_mb', 'is_current_display', 'preview_image'
    )
    list_per_page = 25
    date_hierarchy = 'generated_at'
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('title', 'product_type', 'description'),
            'classes': ('wide',)
        }),
        ('Archivo', {
            'fields': ('filename', 'file_url', 'file_format', 'file_size', 'file_size_mb', 'preview_image'),
            'classes': ('wide',)
        }),
        ('Información Temporal', {
            'fields': ('generated_at', 'valid_from', 'valid_until', 'age_hours', 'is_current_display'),
            'classes': ('wide',)
        }),
        ('Metadatos', {
            'fields': ('region', 'resolution'),
            'classes': ('wide',)
        }),
        ('Estado', {
            'fields': ('is_available', 'last_checked'),
            'classes': ('wide',)
        }),
        ('Sistema', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def product_type_colored(self, obj):
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            obj.product_type.color, obj.product_type.name
        )
    product_type_colored.short_description = 'Tipo'
    
    def file_format_badge(self, obj):
        colors = {
            'png': '#28a745',
            'jpg': '#17a2b8',
            'jpeg': '#17a2b8',
            'gif': '#ffc107',
            'tiff': '#6f42c1'
        }
        color = colors.get(obj.file_format.lower(), '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">{}</span>',
            color, obj.file_format.upper()
        )
    file_format_badge.short_description = 'Formato'
    
    def is_available_badge(self, obj):
        if obj.is_available:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">✓ Disponible</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #dc3545; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">✗ No disponible</span>'
            )
    is_available_badge.short_description = 'Estado'
    
    def file_size_mb(self, obj):
        if obj.file_size:
            size_mb = obj.file_size / (1024*1024)
            if size_mb < 1:
                size_kb = obj.file_size / 1024
                return f"{size_kb:.1f} KB"
            return f"{size_mb:.2f} MB"
        return "N/A"
    file_size_mb.short_description = 'Tamaño'
    
    def age_display(self, obj):
        hours = obj.age_hours
        if hours < 1:
            return format_html('<span style="color: #28a745; font-weight: bold;">Reciente</span>')
        elif hours < 24:
            return format_html('<span style="color: #ffc107;">{}h</span>', int(hours))
        else:
            days = int(hours // 24)
            remaining_hours = int(hours % 24)
            if days > 7:
                return format_html('<span style="color: #dc3545;">{}d {}h</span>', days, remaining_hours)
            else:
                return format_html('<span style="color: #fd7e14;">{}d {}h</span>', days, remaining_hours)
    age_display.short_description = 'Antigüedad'
    
    def preview_link(self, obj):
        if obj.file_url and obj.is_available:
            return format_html(
                '<a href="{}" target="_blank" style="color: #007bff; text-decoration: none;">🔗 Ver imagen</a>',
                obj.file_url
            )
        return format_html('<span style="color: #6c757d;">N/A</span>')
    preview_link.short_description = 'Vista previa'
    
    def is_current_display(self, obj):
        if obj.is_current:
            return format_html('<span style="color: #28a745;">✓ Válido</span>')
        else:
            return format_html('<span style="color: #dc3545;">✗ Expirado</span>')
    is_current_display.short_description = 'Vigencia'
    
    def preview_image(self, obj):
        if obj.file_url and obj.is_available and obj.file_format.lower() in ['png', 'jpg', 'jpeg']:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 150px; border: 1px solid #ddd; border-radius: 4px;" alt="Preview" />',
                obj.file_url
            )
        return format_html('<span style="color: #6c757d;">No disponible</span>')
    preview_image.short_description = 'Vista previa'

    actions = [
        'mark_as_available', 'mark_as_unavailable', 'update_file_info',
        'export_selected_json', 'bulk_update_descriptions'
    ]
    
    def mark_as_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'✅ {updated} productos marcados como disponibles.')
    mark_as_available.short_description = 'Marcar como disponible'
    
    def mark_as_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'❌ {updated} productos marcados como no disponibles.')
    mark_as_unavailable.short_description = 'Marcar como no disponible'
    
    def export_selected_json(self, request, queryset):
        data = []
        for product in queryset:
            data.append({
                'title': product.title,
                'filename': product.filename,
                'file_url': product.file_url,
                'file_format': product.file_format,
                'product_type_code': product.product_type.code,
                'description': product.description,
                'region': product.region,
                'generated_at': product.generated_at.isoformat(),
                'is_available': product.is_available
            })
        
        response = JsonResponse(data, safe=False)
        response['Content-Disposition'] = 'attachment; filename="productos_exportados.json"'
        return response
    export_selected_json.short_description = 'Exportar seleccionados a JSON'
    
    def bulk_update_descriptions(self, request, queryset):
        # Esta es una acción de ejemplo que se puede personalizar
        updated = queryset.update(description="Actualizado desde admin")
        self.message_user(request, f'📝 {updated} productos actualizados.')
    bulk_update_descriptions.short_description = 'Actualizar descripciones'


@admin.register(ProductCollection)
class ProductCollectionAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'product_type', 'product_count', 'is_animation_badge', 
        'animation_speed', 'latest_product_date', 'created_at'
    )
    list_filter = ('product_type', 'is_animation', 'created_at')
    search_fields = ('name', 'description')
    filter_horizontal = ('products',)
    readonly_fields = ('product_count_display', 'latest_product_date_display')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'product_type', 'description')
        }),
        ('Configuración', {
            'fields': ('is_animation', 'animation_speed')
        }),
        ('Productos', {
            'fields': ('products', 'product_count_display', 'latest_product_date_display')
        })
    )
    
    def is_animation_badge(self, obj):
        if obj.is_animation:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">🎬 Animación</span>'
            )
        else:
            return format_html(
                '<span style="background-color: #6c757d; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">📁 Colección</span>'
            )
    is_animation_badge.short_description = 'Tipo'
    
    def product_count_display(self, obj):
        return f"{obj.product_count} productos"
    product_count_display.short_description = 'Total de productos'
    
    def latest_product_date_display(self, obj):
        date = obj.latest_product_date
        if date:
            return date.strftime('%Y-%m-%d %H:%M')
        return "N/A"
    latest_product_date_display.short_description = 'Último producto'


# Personalización del sitio admin
admin.site.site_header = "🌤️ OHMC Weather - Panel de Administración"
admin.site.site_title = "OHMC Weather Admin"
admin.site.index_title = "📊 Dashboard de Productos Meteorológicos"

# Agregar CSS personalizado
class Media:
    css = {
        'all': ('admin/css/custom_admin.css',)
    }
