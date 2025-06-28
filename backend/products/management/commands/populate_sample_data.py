
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from products.models import ProductType, WeatherProduct
import requests
from urllib.parse import urljoin


class Command(BaseCommand):
    help = 'Poblar la base de datos con datos de ejemplo del último mes'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Número de días hacia atrás para generar datos (default: 30)'
        )

    def handle(self, *args, **options):
        days = options['days']
        self.stdout.write(f'Generando datos para los últimos {days} días...')
        
        # Crear tipos de productos
        product_types = [
            {
                'code': 'WRF',
                'name': 'Modelo WRF',
                'description': 'Productos del modelo Weather Research and Forecasting',
                'color': '#3B82F6'
            },
            {
                'code': 'FWI',
                'name': 'Índice de Incendios',
                'description': 'Fire Weather Index - Índice meteorológico de peligro de incendio',
                'color': '#EF4444'
            },
            {
                'code': 'WIND',
                'name': 'Vientos',
                'description': 'Productos de viento y ráfagas',
                'color': '#10B981'
            },
            {
                'code': 'AIR',
                'name': 'Calidad del Aire',
                'description': 'Mediciones de gases de efecto invernadero',
                'color': '#8B5CF6'
            }
        ]

        created_types = {}
        for type_data in product_types:
            product_type, created = ProductType.objects.get_or_create(
                code=type_data['code'],
                defaults=type_data
            )
            created_types[type_data['code']] = product_type
            if created:
                self.stdout.write(f'✓ Creado tipo: {product_type.name}')
            else:
                self.stdout.write(f'→ Ya existe: {product_type.name}')

        # Generar productos para cada día
        base_date = timezone.now().date()
        total_created = 0

        for i in range(days):
            current_date = base_date - timedelta(days=i)
            
            # Productos WRF (2 corridas por día: 06 y 18 UTC)
            for hour in [6, 18]:
                generated_at = timezone.make_aware(
                    datetime.combine(current_date, datetime.min.time().replace(hour=hour))
                )
                
                # Variables WRF
                wrf_variables = [
                    ('t2', 'Temperatura a 2m'),
                    ('ppn', 'Precipitación'),
                    ('wspd10', 'Viento a 10m'),
                    ('rh2', 'Humedad Relativa')
                ]
                
                for var_code, var_name in wrf_variables:
                    filename = f"{var_code}-{current_date.strftime('%Y-%m-%d')}_{hour:02d}+09.png"
                    file_url = f"https://yaku.ohmc.ar/public/wrf/img/CBA/{current_date.strftime('%Y_%m')}/{current_date.strftime('%d')}_{hour:02d}/{var_code}/{filename}"
                    
                    product, created = WeatherProduct.objects.get_or_create(
                        filename=filename,
                        product_type=created_types['WRF'],
                        defaults={
                            'title': f'{var_name} - {current_date.strftime("%d/%m/%Y")} {hour:02d}Z',
                            'file_url': file_url,
                            'file_format': 'png',
                            'generated_at': generated_at,
                            'description': f'Producto WRF para {var_name}',
                            'region': 'Córdoba',
                            'resolution': '1km'
                        }
                    )
                    if created:
                        total_created += 1

            # Producto FWI (1 por día)
            fwi_time = timezone.make_aware(
                datetime.combine(current_date, datetime.min.time().replace(hour=11))
            )
            
            fwi_product, created = WeatherProduct.objects.get_or_create(
                filename=f"FWI-{current_date.strftime('%Y-%m-%d')}.png",
                product_type=created_types['FWI'],
                defaults={
                    'title': f'Fire Weather Index - {current_date.strftime("%d/%m/%Y")}',
                    'file_url': 'https://yaku.ohmc.ar/public/FWI/FWI.png',
                    'file_format': 'png',
                    'generated_at': fwi_time,
                    'description': 'Índice meteorológico de peligro de incendio',
                    'region': 'Córdoba'
                }
            )
            if created:
                total_created += 1

            # Producto de vientos (1 por día) 
            wind_time = timezone.make_aware(
                datetime.combine(current_date, datetime.min.time().replace(hour=11))
            )
            
            wind_product, created = WeatherProduct.objects.get_or_create(
                filename=f"rafagas_rutas-{current_date.strftime('%Y-%m-%d')}.gif",
                product_type=created_types['WIND'],
                defaults={
                    'title': f'Ráfagas en Rutas - {current_date.strftime("%d/%m/%Y")}',
                    'file_url': 'https://yaku.ohmc.ar/public/rutas_caminera/rafagas_rutas.gif',
                    'file_format': 'gif',
                    'generated_at': wind_time,
                    'description': 'Animación de ráfagas de viento sobre rutas provinciales',
                    'region': 'Córdoba'
                }
            )
            if created:
                total_created += 1

            # Productos de calidad del aire (CO2 y CH4)
            air_time = timezone.make_aware(
                datetime.combine(current_date, datetime.min.time().replace(hour=10, minute=30))
            )
            
            for gas in ['CO2', 'CH4']:
                air_product, created = WeatherProduct.objects.get_or_create(
                    filename=f"{gas}_webvisualizer_v4-{current_date.strftime('%Y-%m-%d')}.png",
                    product_type=created_types['AIR'],
                    defaults={
                        'title': f'{gas} - {current_date.strftime("%d/%m/%Y")}',
                        'file_url': f"https://yaku.ohmc.ar/public/MedicionAire/{current_date.strftime('%m')}/{current_date.strftime('%d')}/{gas}_webvisualizer_v4.png",
                        'file_format': 'png',
                        'generated_at': air_time,
                        'description': f'Medición de {gas} por analizador Picarro',
                        'region': 'OHMC'
                    }
                )
                if created:
                    total_created += 1

            if i % 7 == 0:  # Progreso cada semana
                self.stdout.write(f'→ Procesados {i + 1} días...')

        self.stdout.write(
            self.style.SUCCESS(f'✓ Completado! {total_created} productos creados para {days} días')
        )
        
        # Estadísticas finales
        total_products = WeatherProduct.objects.count()
        total_types = ProductType.objects.filter(is_active=True).count()
        
        self.stdout.write(f'\nEstadísticas:')
        self.stdout.write(f'- Tipos de productos: {total_types}')
        self.stdout.write(f'- Total de productos: {total_products}')
        self.stdout.write(f'- Productos disponibles: {WeatherProduct.objects.filter(is_available=True).count()}')
