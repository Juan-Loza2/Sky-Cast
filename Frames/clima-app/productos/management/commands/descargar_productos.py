import requests
from bs4 import BeautifulSoup
from datetime import datetime
from django.core.management.base import BaseCommand
from productos.models import Producto
from django.core.files.base import ContentFile
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import lru_cache
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache para URLs visitadas
visited_urls = set()

class Command(BaseCommand):
    help = 'Descarga productos desde URLs específicas'

    URLS = {
        'FWI': 'https://yaku.ohmc.ar/public/FWI/',
        'GEI': 'https://yaku.ohmc.ar/public/MedicionAire/',
        'RAFAGA': 'https://yaku.ohmc.ar/public/rutas_caminera/',
        'WRF': 'https://yaku.ohmc.ar/public/wrf/img/CENTRO/',
    }

    MAX_DEPTH = 3  # Límite de profundidad de búsqueda
    MAX_WORKERS = 5  # Número máximo de hilos

    def add_arguments(self, parser):
        parser.add_argument(
            '--tipo',
            type=str,
            choices=['FWI', 'GEI', 'RAFAGA', 'WRF'],
            help='Tipo de producto a descargar (FWI, GEI, RAFAGA, WRF)'
        )
        parser.add_argument(
            '--fecha',
            type=str,
            help='Fecha específica a descargar (formato YYYY-MM-DD)'
        )
        parser.add_argument(
            '--desde',
            type=str,
            help='Fecha inicial para rango de fechas (formato YYYY-MM-DD)'
        )
        parser.add_argument(
            '--hasta',
            type=str,
            help='Fecha final para rango de fechas (formato YYYY-MM-DD)'
        )

    def handle(self, *args, **options):
        print('Iniciando descarga de productos...')
        
        # Limpiar la base de datos
        print('Limpiando la base de datos...')
        Producto.objects.all().delete()
        
        # Limpiar cache
        visited_urls.clear()
        
        # Obtener fechas de opciones
        fecha = options.get('fecha')
        desde = options.get('desde')
        hasta = options.get('hasta')
        
        # Validar fechas
        if fecha and (desde or hasta):
            logger.error('No puede especificar --fecha junto con --desde o --hasta')
            return
            
        if desde and not hasta:
            logger.error('Debe especificar --hasta junto con --desde')
            return
            
        if hasta and not desde:
            logger.error('Debe especificar --desde junto con --hasta')
            return
            
        # Obtener URLs a procesar
        urls_a_procesar = {}
        
        # Si se especificó un tipo, solo procesar ese tipo
        if options.get('tipo'):
            tipo = options['tipo']
            if tipo in self.URLS:
                urls_a_procesar[tipo] = self.URLS[tipo]
            else:
                logger.error(f'Tipo no válido: {tipo}')
                return
        else:
            urls_a_procesar = self.URLS
        
        # Recorrer las URLs a procesar
        for tipo, base_url in urls_a_procesar.items():
            print(f'\nDescargando productos tipo {tipo} desde {base_url}')
            try:
                self.descargar_recursivamente(tipo, base_url, depth=0, fecha=fecha, desde=desde, hasta=hasta)
            except Exception as e:
                logger.error(f'Error al acceder a {base_url}: {str(e)}')

        print('\nDescarga completada.')

    @lru_cache(maxsize=128)
    def get_page_content(self, url):
        """Obtener contenido de página con cache"""
        if url in visited_urls:
            return None
        visited_urls.add(url)
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.text
        except Exception as e:
            logger.error(f'Error al obtener contenido de {url}: {str(e)}')
            return None

    def descargar_recursivamente(self, tipo, url_actual, depth=0, fecha=None, desde=None, hasta=None):
        """Función recursiva que explora y descarga todos los archivos"""
        if depth >= self.MAX_DEPTH:
            logger.info(f'Profundidad máxima alcanzada en {url_actual}')
            return

        logger.info(f'\nExplorando {url_actual} (profundidad: {depth})')
        
        page_content = self.get_page_content(url_actual)
        if not page_content:
            return

        soup = BeautifulSoup(page_content, 'html.parser')
        
        # Buscar subcarpetas
        carpetas = [a['href'] for a in soup.find_all('a', href=True) if a['href'].endswith('/')]
        
        # Explorar las subcarpetas recursivamente
        with ThreadPoolExecutor(max_workers=self.MAX_WORKERS) as executor:
            futures = []
            for carpeta in carpetas:
                nueva_url = urljoin(url_actual, carpeta)
                futures.append(executor.submit(
                    self.descargar_recursivamente, tipo, nueva_url, depth + 1, fecha, desde, hasta
                ))
            
            # Esperar a que todas las subcarpetas terminen
            for future in as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    logger.error(f'Error en subcarpeta: {str(e)}')

        # Buscar archivos de imagen en la carpeta actual
        links = [a['href'] for a in soup.find_all('a', href=True) if a['href'].lower().endswith('.png')]
        
        if not links:
            logger.info(f'No se encontraron archivos PNG en {url_actual}')
            return
            
        logger.info(f'Encontrados {len(links)} archivos PNG para descargar')
        
        # Si se especificó una fecha específica, buscar solo ese archivo
        if fecha:
            fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            fecha_str = fecha_obj.strftime('%Y%m%d')
            
            # Buscar el archivo que coincide exactamente con la fecha
            archivo_objetivo = None
            for nombre in links:
                # Buscar archivos que terminen con la fecha específica
                if nombre.endswith(f'_{fecha_str}.png'):
                    archivo_objetivo = nombre
                    break
                # También buscar archivos que contengan la fecha en el medio
                elif f'_{fecha_str}_' in nombre:
                    archivo_objetivo = nombre
                    break
            
            if archivo_objetivo:
                logger.info(f'Encontrado archivo objetivo: {archivo_objetivo}')
                file_url = urljoin(url_actual, archivo_objetivo)
                self.descargar_archivo(tipo, archivo_objetivo, file_url, fecha, desde, hasta)
            else:
                logger.info(f'No se encontró archivo para la fecha {fecha}')
        else:
            # Si no se especificó fecha, buscar archivos que contengan FWI
            archivo_objetivo = None
            for nombre in links:
                if 'FWI' in nombre:
                    archivo_objetivo = nombre
                    break
            
            if archivo_objetivo:
                logger.info(f'Encontrado archivo objetivo: {archivo_objetivo}')
                file_url = urljoin(url_actual, archivo_objetivo)
                self.descargar_archivo(tipo, archivo_objetivo, file_url, fecha, desde, hasta)
            else:
                logger.info('No se encontró archivo FWI')
                
            # Si no se especificó fecha, descargar todos los archivos
            with ThreadPoolExecutor(max_workers=self.MAX_WORKERS) as executor:
                futures = []
                for nombre in links:
                    file_url = urljoin(url_actual, nombre)
                    futures.append(executor.submit(
                        self.descargar_archivo, tipo, nombre, file_url, fecha, desde, hasta
                    ))
                
                # Esperar a que todos los archivos terminen
                for future in as_completed(futures):
                    try:
                        future.result()
                    except Exception as e:
                        logger.error(f'Error descargando archivo: {str(e)}')
            with ThreadPoolExecutor(max_workers=self.MAX_WORKERS) as executor:
                futures = []
                for nombre in links:
                    file_url = urljoin(url_actual, nombre)
                    futures.append(executor.submit(
                        self.descargar_archivo, tipo, nombre, file_url, fecha, desde, hasta
                    ))
                
                # Esperar a que todos los archivos terminen
                for future in as_completed(futures):
                    try:
                        future.result()
                    except Exception as e:
                        logger.error(f'Error descargando archivo: {str(e)}')

    def descargar_archivo(self, tipo, nombre, file_url, fecha=None, desde=None, hasta=None):
        """Función que descarga un archivo individual"""
        logger.info(f'Descargando {nombre}...')
        
        # Verificar que es un archivo PNG
        if not nombre.lower().endswith('.png'):
            logger.info(f'Saltando {nombre}: no es PNG')
            return
            
        try:
            # Descargar archivo
            response = requests.get(file_url, timeout=30)
            response.raise_for_status()
            
            # Verificar que es una imagen PNG
            if not response.headers.get('content-type', '').startswith('image/png'):
                logger.error(f'Error descargando {nombre}: no es una imagen PNG')
                return
                
            # Si se especificó una fecha específica, no necesitamos extraer la fecha
            if fecha:
                # Convertir la fecha especificada a un objeto date
                fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
                
                # Guardar el archivo directamente con la fecha especificada
                producto = Producto(tipo=tipo, nombre=nombre, fecha=fecha_obj)
                producto.archivo.save(nombre, ContentFile(response.content))
                producto.save()
                logger.info(f'Archivo {nombre} descargado y guardado')
                return
                
            # Extraer fecha del nombre del archivo solo si no se especificó fecha
            try:
                # Buscar patrón de fecha en el nombre
                # Los archivos tienen formato: Reporte_FDA20231021_a_20231031.png
                partes = nombre.split('_')
                if len(partes) != 3:
                    raise ValueError('Formato de nombre incorrecto')
                    
                # La fecha está en la segunda parte (ej: FDA20231021)
                fecha_parte = partes[1]
                if not fecha_parte.startswith('FDA'):
                    raise ValueError('Formato de fecha incorrecto')
                    
                # Extraemos solo los números después de FDA
                fecha_archivo = fecha_parte[3:]
                if len(fecha_archivo) != 8:
                    raise ValueError('Formato de nombre incorrecto')
                
                # Convertir a fecha
                fecha_archivo = datetime.strptime(fecha_archivo, '%Y%m%d').date()
                
                # Verificar si cumple con los filtros de fecha
                if desde and hasta:
                    fecha_desde = datetime.strptime(desde, '%Y-%m-%d').date()
                    fecha_hasta = datetime.strptime(hasta, '%Y-%m-%d').date()
                    if fecha_archivo < fecha_desde or fecha_archivo > fecha_hasta:
                        logger.info(f'Saltando {nombre}: fuera del rango de fechas')
                        return
            except Exception as e:
                logger.info(f'No se pudo extraer fecha de {nombre}: {str(e)}')
                return
            
            # Crear y guardar el producto
            producto = Producto(
                tipo=tipo,
                nombre=nombre,
                fecha=fecha_archivo,
                url=file_url
            )
            producto.archivo.save(nombre, ContentFile(file_response.content), save=False)
            producto.save()
            logger.info(f'Producto {nombre} de tipo {tipo} guardado.')
            
        except requests.exceptions.RequestException as e:
            logger.error(f'Error al descargar {nombre}: {str(e)}')
            return
            
        except Exception as e:
            logger.error(f'Error procesando {nombre}: {str(e)}')
            return
