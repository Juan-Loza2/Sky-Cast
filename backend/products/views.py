
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q, Count
from .models import ProductType, WeatherProduct, ProductCollection
from .serializers import (
    ProductTypeSerializer, WeatherProductSerializer, 
    ProductCollectionSerializer, WeatherProductDetailSerializer
)
from .filters import WeatherProductFilter


class ProductTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para tipos de productos meteorológicos.
    
    Endpoints:
    - GET /api/tipos/ - Lista todos los tipos activos
    - GET /api/tipos/{id}/ - Detalle de un tipo específico
    """
    queryset = ProductType.objects.filter(is_active=True)
    serializer_class = ProductTypeSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estadísticas de productos por tipo"""
        types_with_counts = ProductType.objects.filter(is_active=True).annotate(
            product_count=Count('products', filter=Q(products__is_available=True))
        )
        
        stats = []
        for product_type in types_with_counts:
            stats.append({
                'type': ProductTypeSerializer(product_type).data,
                'product_count': product_type.product_count,
                'latest_product': None
            })
            
            # Obtener el producto más reciente
            latest = product_type.products.filter(is_available=True).first()
            if latest:
                stats[-1]['latest_product'] = {
                    'id': latest.id,
                    'title': latest.title,
                    'generated_at': latest.generated_at,
                    'age_hours': latest.age_hours
                }
        
        return Response(stats)


class WeatherProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para productos meteorológicos.
    
    Endpoints:
    - GET /api/productos/ - Lista productos con filtros
    - GET /api/productos/{id}/ - Detalle de un producto
    - GET /api/productos/ultimos/ - Últimos productos por tipo
    """
    queryset = WeatherProduct.objects.filter(is_available=True)
    serializer_class = WeatherProductSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = WeatherProductFilter
    ordering_fields = ['generated_at', 'created_at', 'title']
    ordering = ['-generated_at']
    search_fields = ['title', 'description', 'region']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return WeatherProductDetailSerializer
        return WeatherProductSerializer
    
    @action(detail=False, methods=['get'])
    def ultimos(self, request):
        """Obtiene los últimos productos disponibles por tipo"""
        limit = int(request.query_params.get('limit', 10))
        
        # Obtener el producto más reciente de cada tipo
        latest_products = []
        for product_type in ProductType.objects.filter(is_active=True):
            latest = product_type.products.filter(is_available=True).first()
            if latest:
                latest_products.append(latest)
        
        # Ordenar por fecha de generación y limitar
        latest_products.sort(key=lambda x: x.generated_at, reverse=True)
        latest_products = latest_products[:limit]
        
        serializer = self.get_serializer(latest_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recientes(self, request):
        """Productos generados en las últimas horas"""
        hours = int(request.query_params.get('hours', 24))
        since = timezone.now() - timedelta(hours=hours)
        
        recent_products = self.get_queryset().filter(
            generated_at__gte=since
        ).order_by('-generated_at')
        
        page = self.paginate_queryset(recent_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(recent_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_fecha(self, request):
        """Productos agrupados por fecha"""
        date_str = request.query_params.get('fecha')
        if not date_str:
            return Response(
                {'error': 'Parámetro fecha requerido (formato: YYYY-MM-DD)'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = self.get_queryset().filter(
            generated_at__date=date
        ).order_by('-generated_at')
        
        # Agrupar por tipo
        grouped = {}
        for product in products:
            type_code = product.product_type.code
            if type_code not in grouped:
                grouped[type_code] = {
                    'type': ProductTypeSerializer(product.product_type).data,
                    'products': []
                }
            grouped[type_code]['products'].append(
                WeatherProductSerializer(product).data
            )
        
        return Response({
            'date': date_str,
            'groups': list(grouped.values()),
            'total_products': products.count()
        })


class ProductCollectionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para colecciones de productos meteorológicos.
    """
    queryset = ProductCollection.objects.all()
    serializer_class = ProductCollectionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['product_type', 'is_animation']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['get'])
    def productos(self, request, pk=None):
        """Lista los productos de una colección específica"""
        collection = self.get_object()
        products = collection.products.filter(is_available=True).order_by('generated_at')
        
        serializer = WeatherProductSerializer(products, many=True)
        return Response({
            'collection': ProductCollectionSerializer(collection).data,
            'products': serializer.data
        })
