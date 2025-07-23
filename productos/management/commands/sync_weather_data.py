from django.core.management.base import BaseCommand
from productos.tasks import sync_all_data

class Command(BaseCommand):
    help = 'Sincronizar todos los datos meteorológicos'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--type',
            type=str,
            help='Tipo específico a sincronizar (wrf, aire, fwi, rutas)',
        )
        parser.add_argument(
            '--last-week',
            action='store_true',
            help='Sincronizar solo la última semana',
        )
    
    def handle(self, *args, **options):
        tipo = options.get('type')
        last_week = options.get('last_week')
        
        # Ejecutar sincronización sin Celery para el comando inicial
        from productos.tasks import sync_wrf_data, sync_medicion_aire, sync_fwi_data, sync_rutas_caminera
        results = []
        try:
            if tipo == 'wrf':
                result = sync_wrf_data(last_week=last_week)
                self.stdout.write(self.style.SUCCESS(f'WRF sync: {result}'))
            elif tipo == 'aire':
                result = sync_medicion_aire(last_week=last_week)
                self.stdout.write(self.style.SUCCESS(f'MedicionAire sync: {result}'))
            elif tipo == 'fwi':
                result = sync_fwi_data()
                self.stdout.write(self.style.SUCCESS(f'FWI sync: {result}'))
            elif tipo == 'rutas':
                result = sync_rutas_caminera()
                self.stdout.write(self.style.SUCCESS(f'Rutas sync: {result}'))
            else:
                results.append(sync_wrf_data(last_week=last_week))
                results.append(sync_medicion_aire(last_week=last_week))
                results.append(sync_fwi_data())
                results.append(sync_rutas_caminera())
                self.stdout.write(self.style.SUCCESS(f'All sync completed: {results}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
