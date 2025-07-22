from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from productos.models import TipoProducto, Producto, FechaProducto
from datetime import datetime, date, timedelta
import json
import os
import requests
import logging
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Cargar datos desde el JSON de estructura OHMC con descarga de imágenes'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=3,
            help='Número de días hacia atrás para generar datos (default: 3)',
        )
        parser.add_argument(
            '--json-file',
            type=str,
            default='ohmc_data_structure.json',
            help='Archivo JSON con la estructura de datos (default: ohmc_data_structure.json)',
        )
        parser.add_argument(
            '--download-images',
            action='store_true',
            default=True,
            help='Descargar imágenes físicamente (default: True)',
        )
        parser.add_argument(
            '--no-download',
            action='store_true',
            help='No descargar imágenes, solo crear URLs',
        )
    
    def handle(self, *args, **options):
        days = options['days']
        json_file = options['json_file']
        download_images = options['download_images'] and not options['no_download']
        
        # Usar fecha actual como base (HOY)
        today = date.today()
        
        # Cargar JSON
        json_path = os.path.join('/app', json_file)
        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f'❌ Archivo JSON no encontrado: {json_path}'))
            return
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.stdout.write(self.style.SUCCESS(f'📄 JSON cargado desde: {json_file}'))
        self.stdout.write(self.style.SUCCESS(f'📅 Fecha base: {today} (HOY)'))
        self.stdout.write(self.style.SUCCESS(f'🔄 Generando datos para los últimos {days} días...'))
        if download_images:
            self.stdout.write(self.style.SUCCESS('📥 Descarga de imágenes: ACTIVADA'))
        else:
            self.stdout.write(self.style.WARNING('📥 Descarga de imágenes: DESACTIVADA'))
        
        # 1. Crear tipos de productos
        self.create_tipos_productos(data)
        
        # 2. Cargar datos según el JSON
        total_productos = 0
        total_imagenes = 0
        
        for proyecto_name, proyecto_data in data['proyectos'].items():
            self.stdout.write(f'\n📊 Procesando {proyecto_name}...')
            
            if proyecto_name == 'wrf_cba':
                productos_creados, imagenes_descargadas = self.load_wrf_data(proyecto_data, days, today, download_images)
            elif proyecto_name == 'MedicionAire':
                productos_creados, imagenes_descargadas = self.load_medicion_aire_data(proyecto_data, days, today, download_images)
            elif proyecto_name in ['FWI', 'rutas_caminera', 'rafagas']:
                productos_creados, imagenes_descargadas = self.load_static_data(proyecto_name, proyecto_data, today, download_images)
            else:
                productos_creados, imagenes_descargadas = 0, 0
            
            total_productos += productos_creados
            total_imagenes += imagenes_descargadas
            self.stdout.write(self.style.SUCCESS(f'  ✅ {productos_creados} productos creados, {imagenes_descargadas} imágenes descargadas'))
        
        # 3. Mostrar resumen
        self.show_summary()
        
        self.stdout.write(self.style.SUCCESS(f'\n🎉 ¡Carga completada!'))
        self.stdout.write(self.style.SUCCESS(f'📊 Total productos: {total_productos}'))
        self.stdout.write(self.style.SUCCESS(f'📸 Total imágenes descargadas: {total_imagenes}'))
    
    def download_and_save_image(self, producto, url):
        """Descargar imagen desde URL y guardarla físicamente"""
        try:
            self.stdout.write(f'    📥 Descargando: {os.path.basename(url)}')
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=30, stream=True)
            
            if response.status_code == 200:
                # Obtener nombre del archivo desde la URL
                parsed_url = urlparse(url)
                filename = os.path.basename(parsed_url.path)
                
                # Si no hay extensión, usar .png por defecto
                if not filename or '.' not in filename:
                    filename = f"{producto.nombre_archivo}"
                
                # Guardar imagen en el campo foto
                producto.foto.save(
                    filename,
                    ContentFile(response.content),
                    save=True
                )
                self.stdout.write(self.style.SUCCESS(f'      ✅ Guardada: {filename} ({len(response.content)} bytes)'))
                return True
            elif response.status_code == 404:
                self.stdout.write(self.style.WARNING(f'      ⚠️ No encontrada (404): {os.path.basename(url)}'))
                return False
            else:
                self.stdout.write(self.style.WARNING(f'      ⚠️ Error HTTP {response.status_code}: {os.path.basename(url)}'))
                return False
                
        except requests.exceptions.Timeout:
            self.stdout.write(self.style.WARNING(f'      ⏰ Timeout: {os.path.basename(url)}'))
            return False
        except requests.exceptions.ConnectionError:
            self.stdout.write(self.style.WARNING(f'      🔌 Error de conexión: {os.path.basename(url)}'))
            return False
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'      ❌ Error: {str(e)[:50]}...'))
            return False
    
    def create_tipos_productos(self, data):
        """Crear tipos de productos desde el JSON"""
        self.stdout.write('📋 Creando tipos de productos...')
        
        for proyecto_name, proyecto_data in data['proyectos'].items():
            tipo, created = TipoProducto.objects.get_or_create(
                nombre=proyecto_name,
                defaults={
                    'descripcion': proyecto_data['descripcion'],
                    'url': proyecto_data['url_base']
                }
            )
            
            if created:
                self.stdout.write(f'  ✅ Creado: {tipo.nombre}')
            else:
                # Actualizar descripción si cambió
                tipo.descripcion = proyecto_data['descripcion']
                tipo.url = proyecto_data['url_base']
                tipo.save()
                self.stdout.write(f'  🔄 Actualizado: {tipo.nombre}')
    
    def load_wrf_data(self, proyecto_data, days, today, download_images):
        """Cargar datos WRF basado en el JSON con descarga de imágenes - ÚLTIMOS DÍAS"""
        
        self.stdout.write(f'  📅 Generando desde: {today} hacia atrás ({days} días)')
        
        tipo_wrf = TipoProducto.objects.get(nombre='wrf_cba')
        # Cargar TODAS las variables disponibles del JSON
        variables = list(proyecto_data['variables_disponibles'].keys())
        self.stdout.write(f'  📊 Variables encontradas en JSON: {len(variables)}')
        self.stdout.write(f'  📋 Variables: {", ".join(variables)}')
        productos_creados = 0
        imagenes_descargadas = 0
        
        # Corridas típicas del WRF (06 y 18 UTC)
        corridas = ['06', '18']
        
        # Solo algunas horas de pronóstico para no sobrecargar (cada 3 horas)
        horas_pronostico = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48]
        
        self.stdout.write(f'  ⏰ Horas de pronóstico: {len(horas_pronostico)} ({horas_pronostico})')
        
        # Procesar los últimos N días desde HOY hacia atrás
        for dias_atras in range(days):
            fecha_actual = today - timedelta(days=dias_atras)
            self.stdout.write(f'  📅 Procesando fecha: {fecha_actual}')
            
            for hora_corrida in corridas:
                self.stdout.write(f'    🕐 Corrida: {hora_corrida}:00 UTC')
                
                for variable in variables:
                    variable_productos = 0
                    variable_imagenes = 0
                    
                    for hora_offset in horas_pronostico:
                        # Generar URL según la estructura del JSON
                        # CBA/YYYY_MM/DD_HH/{variable}/{variable}-YYYY-MM-DD_HH+HH.png
                        url = (f"{proyecto_data['url_base']}"
                              f"{fecha_actual.year}_{fecha_actual.month:02d}/"
                              f"{fecha_actual.day:02d}_{hora_corrida}/"
                              f"{variable}/"
                              f"{variable}-{fecha_actual.strftime('%Y-%m-%d')}_{hora_corrida}+{hora_offset:02d}.png")
                        
                        nombre_archivo = f"{variable}-{fecha_actual.strftime('%Y-%m-%d')}_{hora_corrida}+{hora_offset:02d}.png"
                        
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
                            variable_productos += 1
                        
                        # Descargar imagen si está habilitado y no existe
                        if download_images and not producto.foto:
                            if self.download_and_save_image(producto, url):
                                imagenes_descargadas += 1
                                variable_imagenes += 1
                        
                        # Calcular fecha y hora del pronóstico
                        hora_total = int(hora_corrida) + hora_offset
                        
                        if hora_total >= 24:
                            fecha_pronostico = fecha_actual + timedelta(days=hora_total // 24)
                            hora_final = hora_total % 24
                        else:
                            fecha_pronostico = fecha_actual
                            hora_final = hora_total

                        # Crear objeto time correctamente
                        hora_obj = datetime.strptime(f"{hora_final:02d}:00", "%H:%M").time()
                        
                        # Crear fecha de producto
                        FechaProducto.objects.get_or_create(
                            fecha=fecha_pronostico,
                            hora=hora_obj,
                            producto=producto
                        )
                    
                    if variable_productos > 0 or variable_imagenes > 0:
                        self.stdout.write(f'      📊 {variable}: {variable_productos} productos, {variable_imagenes} imágenes')
        
        return productos_creados, imagenes_descargadas
    
    def load_medicion_aire_data(self, proyecto_data, days, today, download_images):
        """Cargar datos de MedicionAire basado en el JSON - ÚLTIMOS DÍAS"""
        
        tipo_aire = TipoProducto.objects.get(nombre='MedicionAire')
        archivos = proyecto_data['archivos']
        productos_creados = 0
        imagenes_descargadas = 0
        
        self.stdout.write(f'  📅 Procesando últimos {days} días desde {today}')
        
        # Procesar los últimos N días desde HOY hacia atrás
        for dias_atras in range(days):
            fecha_actual = today - timedelta(days=dias_atras)
            self.stdout.write(f'    📅 Fecha: {fecha_actual}')
            
            for archivo in archivos:
                # Generar URL según la estructura del JSON: MM/DD/archivo.png
                url = (f"{proyecto_data['url_base']}"
                      f"{fecha_actual.month:02d}/"
                      f"{fecha_actual.day:02d}/"
                      f"{archivo}")
                
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
                
                # Descargar imagen si está habilitado y no existe
                if download_images and not producto.foto:
                    if self.download_and_save_image(producto, url):
                        imagenes_descargadas += 1
                
                # Crear fecha (hora típica de actualización: 10:30)
                FechaProducto.objects.get_or_create(
                    fecha=fecha_actual,
                    hora=datetime.strptime("10:30", "%H:%M").time(),
                    producto=producto
                )
        
        return productos_creados, imagenes_descargadas
    
    def load_static_data(self, proyecto_name, proyecto_data, today, download_images):
        """Cargar datos estáticos (FWI, rutas_caminera) con descarga de imágenes - FECHA ACTUAL"""
        tipo = TipoProducto.objects.get(nombre=proyecto_name)
        productos_creados = 0
        imagenes_descargadas = 0
        
        for archivo in proyecto_data['archivos']:
            url = f"{proyecto_data['url_base']}{archivo}"
            
            # Usar fecha actual para archivos estáticos
            nombre_archivo_con_fecha = f"{today.strftime('%Y-%m-%d')}_{archivo}"
            
            producto, created = Producto.objects.get_or_create(
                tipo_producto=tipo,
                nombre_archivo=nombre_archivo_con_fecha,
                defaults={'url_imagen': url}
            )
            
            if not created:
                producto.url_imagen = url
                producto.save()
            else:
                productos_creados += 1
            
            # Descargar imagen si está habilitado y no existe
            if download_images and not producto.foto:
                if self.download_and_save_image(producto, url):
                    imagenes_descargadas += 1
            
            # Usar fecha actual para archivos estáticos
            FechaProducto.objects.get_or_create(
                fecha=today,
                hora=datetime.strptime("12:00", "%H:%M").time(),
                producto=producto
            )
        
        return productos_creados, imagenes_descargadas
    
    def show_summary(self):
        """Mostrar resumen de datos cargados"""
        self.stdout.write('\n📊 RESUMEN DE DATOS CARGADOS:')
        self.stdout.write('=' * 50)
        
        for tipo in TipoProducto.objects.all():
            count = tipo.producto_set.count()
            con_imagen = tipo.producto_set.exclude(foto='').exclude(foto__isnull=True).count()
            self.stdout.write(f'  - {tipo.nombre}: {count} productos ({con_imagen} con imagen guardada)')
            
            # Mostrar variables únicas para WRF
            if tipo.nombre == 'wrf_cba':
                variables = tipo.producto_set.values_list('variable', flat=True).distinct()
                self.stdout.write(f'    Variables: {len(variables)} ({", ".join(sorted(variables))})')
        
        # Mostrar fechas disponibles
        fechas_unicas = FechaProducto.objects.values_list('fecha', flat=True).distinct().order_by('-fecha')[:10]
        self.stdout.write(f'\n📅 Fechas con datos (últimas 10):')
        for fecha in fechas_unicas:
            count = FechaProducto.objects.filter(fecha=fecha).count()
            self.stdout.write(f'  - {fecha}: {count} registros')
        
        # Total de productos y fechas
        total_productos = Producto.objects.count()
        total_fechas = FechaProducto.objects.count()
        total_con_imagen = Producto.objects.exclude(foto='').exclude(foto__isnull=True).count()
        
        self.stdout.write(f'\n📈 TOTALES:')
        self.stdout.write(f'  - Productos: {total_productos}')
        self.stdout.write(f'  - Registros de fechas: {total_fechas}')
        self.stdout.write(f'  - Imágenes guardadas: {total_con_imagen}/{total_productos}')
