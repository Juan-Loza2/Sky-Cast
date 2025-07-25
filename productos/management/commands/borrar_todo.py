from django.core.management.base import BaseCommand
from productos.models import Producto, FechaProducto, TipoProducto

class Command(BaseCommand):
    help = 'Borra TODOS los datos de productos, fechas y tipos de productos (¡cuidado!)'

    def handle(self, *args, **options):
        FechaProducto.objects.all().delete()
        Producto.objects.all().delete()
        TipoProducto.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('¡Todos los datos de productos, fechas y tipos de productos han sido borrados!')) 