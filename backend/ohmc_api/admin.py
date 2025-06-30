from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.html import format_html
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from products.models import ProductType, WeatherProduct, ProductCollection


class OHMCAdminSite(AdminSite):
    site_header = "🌤️ OHMC Weather - Panel de Administración"
    site_title = "OHMC Weather Admin"
    index_title = "📊 Dashboard de Productos Meteorológicos"
    
    def index(self, request, extra_context=None):
        """
        Display the main admin index page with custom statistics.
        """
        # Estadísticas generales
        total_products = WeatherProduct.objects.count()
        total_types = ProductType.objects.filter(is_active=True).count()
        available_products = WeatherProduct.objects.filter(is_available=True).count()
        
        # Productos recientes (últimas 24 horas)
        recent_products = WeatherProduct.objects.filter(
            generated_at__gte=timezone.now() - timedelta(hours=24)
        ).count()
        
        # Productos por tipo
        products_by_type = ProductType.objects.filter(is_active=True).annotate(
            product_count=Count('products')
        ).order_by('-product_count')
        
        # Productos más recientes
        latest_products = WeatherProduct.objects.filter(
            is_available=True
        ).order_by('-generated_at')[:5]
        
        # Estadísticas de formato de archivos
        format_stats = WeatherProduct.objects.values('file_format').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Productos por región
        region_stats = WeatherProduct.objects.exclude(
            region__isnull=True
        ).exclude(region='').values('region').annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        extra_context = extra_context or {}
        extra_context.update({
            'total_products': total_products,
            'total_types': total_types,
            'available_products': available_products,
            'recent_products': recent_products,
            'products_by_type': products_by_type,
            'latest_products': latest_products,
            'format_stats': format_stats,
            'region_stats': region_stats,
        })
        
        return super().index(request, extra_context)


# Crear instancia personalizada del admin site
admin_site = OHMCAdminSite(name='ohmc_admin')

# Registrar los modelos en el admin personalizado
from products.admin import ProductTypeAdmin, WeatherProductAdmin, ProductCollectionAdmin

admin_site.register(ProductType, ProductTypeAdmin)
admin_site.register(WeatherProduct, WeatherProductAdmin)
admin_site.register(ProductCollection, ProductCollectionAdmin) 