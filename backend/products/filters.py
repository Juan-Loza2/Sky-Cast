
import django_filters
from django.db.models import Q
from .models import WeatherProduct, ProductType


class WeatherProductFilter(django_filters.FilterSet):
    """Filtros para productos meteorológicos"""
    
    # Filtros por tipo
    tipo = django_filters.ModelChoiceFilter(
        field_name='product_type',
        queryset=ProductType.objects.filter(is_active=True),
        help_text="Filtrar por tipo de producto"
    )
    
    tipo_codigo = django_filters.CharFilter(
        field_name='product_type__code',
        lookup_expr='iexact',
        help_text="Filtrar por código de tipo (ej: FWI, RAD)"
    )
    
    # Filtros temporales
    fecha = django_filters.DateFilter(
        field_name='generated_at',
        lookup_expr='date',
        help_text="Filtrar por fecha específica (YYYY-MM-DD)"
    )
    
    fecha_desde = django_filters.DateTimeFilter(
        field_name='generated_at',
        lookup_expr='gte',
        help_text="Productos generados desde esta fecha/hora"
    )
    
    fecha_hasta = django_filters.DateTimeFilter(
        field_name='generated_at',
        lookup_expr='lte',
        help_text="Productos generados hasta esta fecha/hora"
    )
    
    # Filtros por formato
    formato = django_filters.CharFilter(
        field_name='file_format',
        lookup_expr='iexact',
        help_text="Filtrar por formato de archivo (gif, png, jpg)"
    )
    
    # Filtros por región
    region = django_filters.CharFilter(
        field_name='region',
        lookup_expr='icontains',
        help_text="Filtrar por región geográfica"
    )
    
    # Filtros de estado
    disponible = django_filters.BooleanFilter(
        field_name='is_available',
        help_text="Solo productos disponibles"
    )
    
    # Filtro de antigüedad (en horas)
    max_horas = django_filters.NumberFilter(
        method='filter_by_max_age',
        help_text="Productos con antigüedad máxima en horas"
    )
    
    # Búsqueda en múltiples campos
    buscar = django_filters.CharFilter(
        method='filter_search',
        help_text="Buscar en título, descripción y región"
    )
    
    class Meta:
        model = WeatherProduct
        fields = []
    
    def filter_by_max_age(self, queryset, name, value):
        """Filtrar por antigüedad máxima en horas"""
        if value:
            from django.utils import timezone
            from datetime import timedelta
            
            cutoff_time = timezone.now() - timedelta(hours=value)
            return queryset.filter(generated_at__gte=cutoff_time)
        return queryset
    
    def filter_search(self, queryset, name, value):
        """Búsqueda en múltiples campos"""
        if value:
            return queryset.filter(
                Q(title__icontains=value) |
                Q(description__icontains=value) |
                Q(region__icontains=value) |
                Q(filename__icontains=value)
            )
        return queryset


class ProductTypeFilter(django_filters.FilterSet):
    """Filtros para tipos de productos"""
    
    activo = django_filters.BooleanFilter(
        field_name='is_active',
        help_text="Solo tipos activos"
    )
    
    con_productos = django_filters.BooleanFilter(
        method='filter_with_products',
        help_text="Solo tipos que tienen productos"
    )
    
    class Meta:
        model = ProductType
        fields = ['code']
    
    def filter_with_products(self, queryset, name, value):
        """Filtrar tipos que tienen productos disponibles"""
        if value:
            return queryset.filter(products__is_available=True).distinct()
        return queryset
