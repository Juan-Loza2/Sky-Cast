from django.core.management.base import BaseCommand
from productos.models import Producto
from django.db.models import Count

class Command(BaseCommand):
    help = 'Elimina productos duplicados dejando solo uno por combinación de tipo_producto, variable y nombre_archivo.'

    def handle(self, *args, **options):
        dups = Producto.objects.values('tipo_producto', 'variable', 'nombre_archivo').annotate(c=Count('id')).filter(c__gt=1)
        total = 0
        for d in dups:
            qs = Producto.objects.filter(
                tipo_producto=d['tipo_producto'],
                variable=d['variable'],
                nombre_archivo=d['nombre_archivo']
            ).order_by('id')
            ids = list(qs.values_list('id', flat=True))
            for id_to_delete in ids[1:]:
                Producto.objects.filter(id=id_to_delete).delete()
                total += 1
        self.stdout.write(self.style.SUCCESS(f'Eliminados {total} productos duplicados.')) 