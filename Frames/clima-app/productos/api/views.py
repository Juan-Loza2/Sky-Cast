from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from productos.models import Producto
from productos.serializers import ProductoSerializer
from django_filters.rest_framework import DjangoFilterBackend

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo', 'fecha']

@api_view(['GET'])
def json_productos(request):
    productos = Producto.objects.all().values('tipo', 'nombre', 'fecha', 'url')
    return Response(list(productos))
