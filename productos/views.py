from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from datetime import datetime, date
from .models import TipoProducto, Producto, FechaProducto
from .serializers import (
    TipoProductoSerializer, 
    ProductoSerializer, 
    ProductoListSerializer,
    FechaProductoSerializer
)
import logging
from django.http import JsonResponse
import json
import os

logger = logging.getLogger(__name__)

class TipoProductoListView(generics.ListAPIView):
    queryset = TipoProducto.objects.all()
    serializer_class = TipoProductoSerializer

class ProductoListView(generics.ListAPIView):
    queryset = Producto.objects.select_related('tipo_producto').prefetch_related('fechas')
    serializer_class = ProductoListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['tipo_producto__nombre', 'variable']
    search_fields = ['nombre_archivo', 'tipo_producto__nombre']
    ordering_fields = ['fechas__fecha', 'fechas__hora']
    ordering = ['-fechas__fecha', '-fechas__hora']
    
    def get_queryset(self):
        queryset = Producto.objects.select_related('tipo_producto').prefetch_related('fechas')
        
        # Log para debugging
        logger.info(f"ProductoListView - Query params: {self.request.query_params}")
        
        # Filtro por tipo
        tipo = self.request.query_params.get('tipo', None)
        if tipo:
            queryset = queryset.filter(tipo_producto__nombre=tipo)
            logger.info(f"Filtered by tipo: {tipo}")
        
        # Filtro por fecha
        fecha = self.request.query_params.get('fecha', None)
        if fecha:
            try:
                fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
                queryset = queryset.filter(fechas__fecha=fecha_obj)
                logger.info(f"Filtered by fecha: {fecha_obj}")
            except ValueError:
                logger.warning(f"Invalid date format: {fecha}")
        
        # Filtro por variable (para WRF)
        variable = self.request.query_params.get('variable', None)
        if variable:
            queryset = queryset.filter(variable=variable)
            logger.info(f"Filtered by variable: {variable}")
        
        result_queryset = queryset.distinct()
        logger.info(f"Final queryset count: {result_queryset.count()}")
        
        return result_queryset

class ProductoDetailView(generics.RetrieveAPIView):
    queryset = Producto.objects.select_related('tipo_producto').prefetch_related('fechas')
    serializer_class = ProductoSerializer

@api_view(['GET'])
def ultimos_productos(request):
    """Endpoint para obtener los últimos productos de cada tipo"""
    tipos = TipoProducto.objects.all()
    resultados = []
    
    for tipo in tipos:
        ultimo_producto = Producto.objects.filter(
            tipo_producto=tipo
        ).prefetch_related('fechas').first()
        
        if ultimo_producto:
            serializer = ProductoSerializer(ultimo_producto)
            resultados.append(serializer.data)
    
    logger.info(f"ultimos_productos - Returning {len(resultados)} products")
    return Response(resultados)

@api_view(['GET'])
def productos_por_fecha_hora(request):
    """Endpoint específico para WRF con filtros de fecha y hora"""
    fecha = request.query_params.get('fecha')
    hora = request.query_params.get('hora')
    variable = request.query_params.get('variable')
    
    logger.info(f"productos_por_fecha_hora - fecha: {fecha}, hora: {hora}, variable: {variable}")
    
    if not fecha or not hora:
        return Response({'error': 'Se requieren parámetros fecha y hora'}, status=400)
    
    try:
        fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
        hora_obj = datetime.strptime(hora, '%H:%M').time()
    except ValueError:
        return Response({'error': 'Formato de fecha u hora inválido'}, status=400)
    
    queryset = Producto.objects.filter(
        fechas__fecha=fecha_obj,
        fechas__hora=hora_obj,
        tipo_producto__nombre='wrf_cba'
    )
    
    if variable:
        queryset = queryset.filter(variable=variable)
    
    logger.info(f"productos_por_fecha_hora - Found {queryset.count()} products")
    
    serializer = ProductoListSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def fechas_disponibles(request):
    """Endpoint para obtener todas las fechas disponibles por tipo de producto"""
    tipo = request.query_params.get('tipo', 'wrf_cba')
    
    fechas = FechaProducto.objects.filter(
        producto__tipo_producto__nombre=tipo
    ).values('fecha').annotate(
        total_productos=Count('id'),
        variables_count=Count('producto__variable', distinct=True),
        horas_count=Count('hora', distinct=True)
    ).order_by('-fecha')
    
    return Response(list(fechas))

@api_view(['GET'])
def horas_disponibles(request):
    """Endpoint para obtener horas disponibles para una fecha específica"""
    fecha = request.query_params.get('fecha')
    tipo = request.query_params.get('tipo', 'wrf_cba')
    variable = request.query_params.get('variable')
    
    if not fecha:
        return Response({'error': 'Se requiere parámetro fecha'}, status=400)
    
    try:
        fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Formato de fecha inválido'}, status=400)
    
    queryset = FechaProducto.objects.filter(
        fecha=fecha_obj,
        producto__tipo_producto__nombre=tipo
    )
    
    if variable:
        queryset = queryset.filter(producto__variable=variable)
    
    horas = queryset.values('hora').annotate(
        total_productos=Count('id'),
        variables_count=Count('producto__variable', distinct=True)
    ).order_by('hora')
    
    return Response(list(horas))

@api_view(['GET'])
def variables_disponibles(request):
    """Endpoint para obtener variables disponibles para WRF"""
    fecha = request.query_params.get('fecha')
    
    queryset = Producto.objects.filter(tipo_producto__nombre='wrf_cba')
    
    if fecha:
        try:
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            queryset = queryset.filter(fechas__fecha=fecha_obj)
        except ValueError:
            pass
    
    variables = queryset.values('variable').annotate(
        total_productos=Count('id'),
        fechas_count=Count('fechas__fecha', distinct=True),
        horas_count=Count('fechas__hora', distinct=True)
    ).order_by('variable')
    
    return Response(list(variables))

@api_view(['GET'])
def estadisticas(request):
    """Endpoint con estadísticas generales"""
    from django.db.models import Count
    from datetime import timedelta
    
    hoy = date.today()
    hace_30_dias = hoy - timedelta(days=30)
    
    stats = {
        'total_productos': Producto.objects.count(),
        'total_tipos': TipoProducto.objects.count(),
        'productos_ultimo_mes': FechaProducto.objects.filter(
            fecha__gte=hace_30_dias
        ).count(),
        'productos_por_tipo': list(
            TipoProducto.objects.annotate(
                count=Count('producto')
            ).values('nombre', 'count')
        ),
        'variables_wrf': list(
            Producto.objects.filter(
                tipo_producto__nombre='wrf_cba'
            ).values_list('variable', flat=True).distinct()
        ),
        'fechas_disponibles': list(
            FechaProducto.objects.values_list('fecha', flat=True).distinct().order_by('-fecha')[:30]
        ),
        'datos_por_fecha': list(
            FechaProducto.objects.filter(
                producto__tipo_producto__nombre='wrf_cba'
            ).values('fecha').annotate(
                total=Count('id'),
                variables=Count('producto__variable', distinct=True),
                horas=Count('hora', distinct=True)
            ).order_by('-fecha')[:10]
        )
    }
    
    logger.info(f"estadisticas - {stats}")
    return Response(stats)

@api_view(['GET'])
def imagen_dinamica(request):
    """Construye y devuelve la URL de una imagen dinámica según parámetros y el JSON de configuración."""
    proyecto = request.query_params.get('proyecto')
    fecha = request.query_params.get('fecha')  # formato YYYY-MM-DD
    hora = request.query_params.get('hora')    # formato HH (opcional)
    variable = request.query_params.get('variable')
    offset = request.query_params.get('offset')  # +24, +48, etc.

    # Cargar el JSON de configuración (puedes ajustar la ruta si lo guardas en otro lado)
    config_path = os.path.join(os.path.dirname(__file__), '../ohmc_data_structure.json')
    with open(config_path, 'r') as f:
        config = json.load(f)

    if not proyecto or proyecto not in config['proyectos']:
        return JsonResponse({'error': 'Proyecto inválido'}, status=400)
    if not fecha or not variable or not offset:
        return JsonResponse({'error': 'Faltan parámetros requeridos'}, status=400)

    # Parsear fecha
    try:
        year, month, day = fecha.split('-')
    except Exception:
        return JsonResponse({'error': 'Formato de fecha inválido'}, status=400)

    # Obtener info del proyecto
    pj = config['proyectos'][proyecto]
    url_base = pj['url_base'].rstrip('/')
    estructura_dir = pj.get('estructura_directorios', '')
    estructura_arch = pj.get('estructura_archivos', '')

    # Determinar DD_HH
    if hora:
        dd_hh = f"{day}_{hora}"
    else:
        dd_hh = day  # fallback

    # Construir path
    dir_path = estructura_dir.replace('YYYY', year).replace('MM', month).replace('DD_HH', dd_hh).replace('{variable}', variable)
    file_name = estructura_arch.replace('{variable}', variable).replace('YYYY', year).replace('MM', month).replace('DD', day).replace('HH', hora if hora else '').replace('+HH', offset)
    url = f"{url_base}/{dir_path}{file_name}"
    return JsonResponse({'url': url})
