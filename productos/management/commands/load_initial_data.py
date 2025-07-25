from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from productos.models import TipoProducto, Producto, FechaProducto
from datetime import datetime, date, timedelta
import requests
import logging
from urllib.parse import urlparse
import os

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Cargar datos iniciales y descargar imágenes disponibles'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=7,
            help='Número de días hacia atrás para cargar datos (default: 7)',
        )
        parser.add_argument(
            '--download-images',
            action='store_true',
            help='Descargar imágenes automáticamente',
        )
        parser.add_argument(
            '--start-date',
            type=str,
            help='Fecha de inicio en formato YYYY-MM-DD (default: fecha basada en última actualización conocida)',
        )
    
    def handle(self, *args, **options):
        days = options['days']
        download_images = options.get('download_images', True)
        start_date_str = options.get('start_date')
        
        # Usar fecha basada en la última actualización conocida del servidor OHMC
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        else:
            # Basado en el JSON: última actualización 2025-06-26
            start_date = date(2025, 6, 26)
        
        self.stdout.write(self.style.SUCCESS(f'🚀 Iniciando carga de datos desde {start_date} ({days} días hacia atrás)...'))
        if download_images:
            self.stdout.write(self.style.SUCCESS('📥 Descarga de imágenes: ACTIVADA'))
        
        # 1. Crear tipos de productos
        self.create_tipos_productos()
        
        # 2. Cargar datos
        self.load_wrf_data(start_date, days, download_images)
        self.load_medicion_aire_data(start_date, days, download_images)
        self.load_fwi_data(download_images)
        self.load_rutas_data(download_images)
        
        # 3. Mostrar resumen
        self.show_summary()
        
        self.stdout.write(self.style.SUCCESS('✅ Carga de datos completada!'))
    
    def download_and_save_image(self, producto, url):
        """Descargar imagen desde URL y guardarla en el modelo"""
        try:
            self.stdout.write(f'  📥 Intentando: {os.path.basename(url)}')
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15, stream=True)
            
            if response.status_code == 200:
                # Obtener nombre del archivo desde la URL
                parsed_url = urlparse(url)
                filename = os.path.basename(parsed_url.path)
                
                # Si no hay extensión, usar .png por defecto
                if not filename or '.' not in filename:
                    filename = f"{producto.nombre_archivo}.png"
                
                # Guardar imagen en el campo url_imagen
                producto.url_imagen = url
                producto.save()
                self.stdout.write(self.style.SUCCESS(f'    ✅ Guardada: {filename}'))
                return True
            elif response.status_code == 404:
                self.stdout.write(self.style.WARNING(f'    ⚠️ No encontrada (404): {os.path.basename(url)}'))
                return False
            else:
                self.stdout.write(self.style.WARNING(f'    ⚠️ Error HTTP {response.status_code}'))
                return False
                
        except requests.exceptions.Timeout:
            self.stdout.write(self.style.WARNING(f'    ⏰ Timeout: {os.path.basename(url)}'))
            return False
        except requests.exceptions.ConnectionError:
            self.stdout.write(self.style.WARNING(f'    🔌 Error de conexión: {os.path.basename(url)}'))
            return False
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'    ❌ Error: {str(e)[:50]}...'))
            return False
    
    def create_tipos_productos(self):
        """Crear los tipos de productos iniciales"""
        self.stdout.write('📊 Creando tipos de productos...')
        
        tipos = [
            {
                'nombre': 'wrf_cba',
                'descripcion': 'Productos horarios generados por el modelo WRF para Córdoba, con actualizaciones diarias y dos corridas por día.',
                'url': 'https://yaku.ohmc.ar/public/wrf/img/CBA/'
            },
            {
                'nombre': 'MedicionAire',
                'descripcion': 'Visualizaciones diarias de gases de efecto invernadero (CO₂ y CH₄) medidos por el analizador Picarro en el OHMC.',
                'url': 'https://yaku.ohmc.ar/public/MedicionAire/'
            },
            {
                'nombre': 'FWI',
                'descripcion': 'Índice meteorológico de peligro de incendio (Fire Weather Index).',
                'url': 'https://yaku.ohmc.ar/public/FWI/'
            },
            {
                'nombre': 'rutas_caminera',
                'descripcion': 'Animación de ráfagas de viento sobre rutas provinciales para apoyo vial.',
                'url': 'https://yaku.ohmc.ar/public/rutas_caminera/'
            }
        ]
        
        for tipo_data in tipos:
            tipo, created = TipoProducto.objects.get_or_create(
                nombre=tipo_data['nombre'],
                defaults={
                    'descripcion': tipo_data['descripcion'],
                    'url': tipo_data['url']
                }
            )
            if created:
                self.stdout.write(f'  ✅ Creado: {tipo.nombre}')
            else:
                self.stdout.write(f'  ℹ️ Ya existe: {tipo.nombre}')
    
    def load_wrf_data(self, start_date, days=7, download_images=True):
        """Cargar datos WRF desde fecha específica"""
        self.stdout.write(f'🌡️ Cargando datos WRF desde {start_date} ({days} días hacia atrás)...')
        
        tipo_wrf = TipoProducto.objects.get(nombre='wrf_cba')
        
        # Variables principales del JSON
        variables = ['t2', 'ppn', 'wspd10', 'rh2', 'ppnaccum']
        variables_permitidas = ["t2", "ppnaccum", "rh2", "max_dbz", "wdir10", "wspd10"]
        variables = [v for v in variables if v in variables_permitidas]
        
        productos_creados = 0
        imagenes_descargadas = 0
        imagenes_intentadas = 0
        
        for dias_atras in range(days):
            fecha_actual = start_date - timedelta(days=dias_atras)
            self.stdout.write(f'  📅 Procesando fecha: {fecha_actual}')
            
            # Solo corridas principales (06 y 18 UTC)
            for hora_corrida in ['06', '18']:
                for variable in variables:
                    # Solo algunas horas para no sobrecargar
                    for hora_pronostico in [0, 6, 12, 18]:
                        hora_str = f"{hora_pronostico:02d}"
                        
                        # Estructura según el JSON: CBA/YYYY_MM/DD_HH/{variable}/{variable}-YYYY-MM-DD_HH+HH.png
                        url = f"https://yaku.ohmc.ar/public/wrf/img/CBA/{fecha_actual.year}_{fecha_actual.month:02d}/{fecha_actual.day:02d}_{hora_corrida}/{variable}/{variable}-{fecha_actual.strftime('%Y-%m-%d')}_{hora_corrida}+{hora_str}.png"
                        
                        nombre_archivo = f"{variable}-{fecha_actual.strftime('%Y-%m-%d')}_{hora_corrida}+{hora_str}.png"
                        
                        # Crear producto
                        producto, created = Producto.objects.get_or_create(
                            tipo_producto=tipo_wrf,
                            variable=variable,
                            nombre_archivo=nombre_archivo,
                            defaults={'url_imagen': url}
                        )
                        
                        if not created:
                            producto.url_imagen = url
                            producto.save()
                        else:
                            productos_creados += 1
                        
                        # Descargar imagen si está habilitado y no existe
                        if download_images and not producto.url_imagen:
                            imagenes_intentadas += 1
                            if self.download_and_save_image(producto, url):
                                imagenes_descargadas += 1
                        
                        # Crear fecha de producto
                        try:
                            hora_total = int(hora_corrida) + hora_pronostico
                            
                            if hora_total >= 24:
                                fecha_pronostico = fecha_actual + timedelta(days=1)
                                hora_final = hora_total - 24
                            else:
                                fecha_pronostico = fecha_actual
                                hora_final = hora_total
                            
                            hora_obj = datetime.strptime(f"{hora_final:02d}:00", "%H:%M").time()
                            
                            FechaProducto.objects.get_or_create(
                                fecha=fecha_pronostico,
                                hora=hora_obj,
                                producto=producto
                            )
                        except Exception as e:
                            continue
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ WRF: {productos_creados} productos creados'))
        self.stdout.write(self.style.SUCCESS(f'  📸 Imágenes: {imagenes_descargadas}/{imagenes_intentadas} descargadas'))
    
    def load_medicion_aire_data(self, start_date, days=7, download_images=True):
        """Cargar datos de medición de aire desde fecha específica"""
        self.stdout.write(f'🌬️ Cargando datos de medición de aire desde {start_date} ({days} días hacia atrás)...')
        
        tipo_aire = TipoProducto.objects.get(nombre='MedicionAire')
        archivos = ['CH4_webvisualizer_v4.png', 'CO2_webvisualizer_v4.png']
        productos_creados = 0
        imagenes_descargadas = 0
        imagenes_intentadas = 0
        
        for dias_atras in range(days):
            fecha_actual = start_date - timedelta(days=dias_atras)
            
            for archivo in archivos:
                # Estructura según el JSON: MM/DD/archivo.png
                url = f"https://yaku.ohmc.ar/public/MedicionAire/{fecha_actual.month:02d}/{fecha_actual.day:02d}/{archivo}"
                nombre_archivo_con_fecha = f"{fecha_actual.strftime('%Y-%m-%d')}_{archivo}"
                
                producto, created = Producto.objects.get_or_create(
                    tipo_producto=tipo_aire,
                    nombre_archivo=nombre_archivo_con_fecha,
                    defaults={'url_imagen': url}
                )
                
                if not created:
                    producto.url_imagen = url
                    producto.save()
                else:
                    productos_creados += 1
                
                # Descargar imagen
                if download_images and not producto.url_imagen:
                    imagenes_intentadas += 1
                    if self.download_and_save_image(producto, url):
                        imagenes_descargadas += 1
                
                FechaProducto.objects.get_or_create(
                    fecha=fecha_actual,
                    hora=datetime.strptime("10:30", "%H:%M").time(),
                    producto=producto
                )
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ MedicionAire: {productos_creados} productos creados'))
        self.stdout.write(self.style.SUCCESS(f'  📸 Imágenes: {imagenes_descargadas}/{imagenes_intentadas} descargadas'))
    
    def load_fwi_data(self, download_images=True):
        """Cargar datos FWI"""
        self.stdout.write('🔥 Cargando datos FWI...')
        
        tipo_fwi = TipoProducto.objects.get(nombre='FWI')
        url = "https://yaku.ohmc.ar/public/FWI/FWI.png"
        
        producto, created = Producto.objects.get_or_create(
            tipo_producto=tipo_fwi,  # Corregido: era tipo_fwi
            nombre_archivo='FWI.png',
            defaults={'url_imagen': url}
        )
        
        if not created:
            producto.url_imagen = url
            producto.save()
        
        imagenes_descargadas = 0
        if download_images and not producto.url_imagen:
            if self.download_and_save_image(producto, url):
                imagenes_descargadas = 1
        
        FechaProducto.objects.get_or_create(
            fecha=date(2025, 6, 26),  # Fecha de última actualización conocida
            hora=datetime.strptime("11:00", "%H:%M").time(),
            producto=producto
        )
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ FWI: 1 producto creado, {imagenes_descargadas} imágenes descargadas'))
    
    def load_rutas_data(self, download_images=True):
        """Cargar datos de rutas caminera"""
        self.stdout.write('🛣️ Cargando datos de rutas...')
        
        tipo_rutas = TipoProducto.objects.get(nombre='rutas_caminera')
        url = "https://yaku.ohmc.ar/public/rutas_caminera/rafagas_rutas.gif"
        
        producto, created = Producto.objects.get_or_create(
            tipo_producto=tipo_rutas,
            nombre_archivo='rafagas_rutas.gif',
            defaults={'url_imagen': url}
        )
        
        if not created:
            producto.url_imagen = url
            producto.save()
        
        imagenes_descargadas = 0
        if download_images and not producto.url_imagen:
            if self.download_and_save_image(producto, url):
                imagenes_descargadas = 1
        
        FechaProducto.objects.get_or_create(
            fecha=date(2025, 6, 26),  # Fecha de última actualización conocida
            hora=datetime.strptime("11:00", "%H:%M").time(),
            producto=producto
        )
        
        self.stdout.write(self.style.SUCCESS(f'  ✅ Rutas: 1 producto creado, {imagenes_descargadas} imágenes descargadas'))
    
    def show_summary(self):
        """Mostrar resumen de datos cargados"""
        self.stdout.write('\n📊 RESUMEN DE DATOS CARGADOS:')
        self.stdout.write('=' * 40)
        
        for tipo in TipoProducto.objects.all():
            count = tipo.producto_set.count()
            con_imagen = tipo.producto_set.exclude(url_imagen='').exclude(url_imagen__isnull=True).count()
            self.stdout.write(f'  - {tipo.nombre}: {count} productos ({con_imagen} con imagen)')
        
        # Total de imágenes guardadas
        total_con_imagen = Producto.objects.exclude(url_imagen='').exclude(url_imagen__isnull=True).count()
        total_productos = Producto.objects.count()
        self.stdout.write(f'\n📸 Total imágenes guardadas: {total_con_imagen}/{total_productos}')
        
        # Mostrar fechas disponibles
        fechas_unicas = FechaProducto.objects.values_list('fecha', flat=True).distinct().order_by('-fecha')[:5]
        self.stdout.write(f'\n📅 Fechas con datos (últimas 5):')
        for fecha in fechas_unicas:
            count = FechaProducto.objects.filter(fecha=fecha).count()
            self.stdout.write(f'  - {fecha}: {count} registros')
