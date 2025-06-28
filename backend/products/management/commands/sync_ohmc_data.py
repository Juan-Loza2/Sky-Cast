
import requests
import re
import logging
from datetime import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from products.models import ProductType, WeatherProduct
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Sincroniza datos de productos meteorológicos desde el servidor OHMC'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Ejecutar sin hacer cambios en la base de datos',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Forzar actualización de productos existentes',
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=100,
            help='Límite de productos a procesar',
        )
    
    def handle(self, *args, **options):
        self.dry_run = options['dry_run']
        self.force = options['force']
        self.limit = options['limit']
        
        if self.dry_run:
            self.stdout.write(
                self.style.WARNING('Ejecutando en modo DRY RUN - no se harán cambios')
            )
        
        try:
            self.sync_data()
        except Exception as e:
            logger.error(f"Error en sincronización: {e}")
            self.stdout.write(
                self.style.ERROR(f'Error: {e}')
            )
    
    def sync_data(self):
        """Sincroniza datos desde el servidor OHMC"""
        base_url = settings.OHMC_PUBLIC_URL
        
        self.stdout.write(f'Conectando a: {base_url}')
        
        # Obtener listado de archivos
        try:
            response = requests.get(base_url, timeout=30)
            response.raise_for_status()
        except requests.RequestException as e:
            raise Exception(f"Error al conectar con OHMC: {e}")
        
        # Parsear HTML para obtener lista de archivos
        files = self.parse_file_list(response.text, base_url)
        
        if not files:
            self.stdout.write(
                self.style.WARNING('No se encontraron archivos para procesar')
            )
            return
        
        self.stdout.write(f'Encontrados {len(files)} archivos')
        
        # Procesar archivos
        processed = 0
        created = 0
        updated = 0
        
        for file_info in files[:self.limit]:
            try:
                result = self.process_file(file_info)
                if result == 'created':
                    created += 1
                elif result == 'updated':
                    updated += 1
                processed += 1
                
                if processed % 10 == 0:
                    self.stdout.write(f'Procesados: {processed}/{len(files)}')
                    
            except Exception as e:
                logger.error(f"Error procesando {file_info['filename']}: {e}")
                continue
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Sincronización completada: {processed} procesados, '
                f'{created} creados, {updated} actualizados'
            )
        )
    
    def parse_file_list(self, html_content, base_url):
        """Parsea el HTML para extraer lista de archivos"""
        files = []
        
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Buscar enlaces a archivos de imagen
            for link in soup.find_all('a', href=True):
                href = link['href']
                
                # Filtrar solo archivos de imagen meteorológica
                if any(ext in href.lower() for ext in ['.gif', '.png', '.jpg', '.jpeg']):
                    filename = href.split('/')[-1]
                    
                    # Extraer información del nombre del archivo
                    file_info = self.parse_filename(filename)
                    if file_info:
                        file_info['url'] = urljoin(base_url, href)
                        file_info['filename'] = filename
                        files.append(file_info)
                        
        except Exception as e:
            logger.error(f"Error parseando HTML: {e}")
        
        return files
    
    def parse_filename(self, filename):
        """Extrae información meteorológica del nombre del archivo"""
        # Patrones comunes en archivos meteorológicos
        patterns = {
            'fwi': r'fwi.*?(\d{4})(\d{2})(\d{2}).*?(\d{2})(\d{2})',
            'radar': r'radar.*?(\d{4})(\d{2})(\d{2}).*?(\d{2})(\d{2})',
            'satelite': r'sat.*?(\d{4})(\d{2})(\d{2}).*?(\d{2})(\d{2})',
            'precipitacion': r'prec.*?(\d{4})(\d{2})(\d{2}).*?(\d{2})(\d{2})',
            'temperatura': r'temp.*?(\d{4})(\d{2})(\d{2}).*?(\d{2})(\d{2})',
        }
        
        filename_lower = filename.lower()
        
        for product_code, pattern in patterns.items():
            match = re.search(pattern, filename_lower)
            if match:
                year, month, day, hour, minute = map(int, match.groups())
                
                try:
                    generated_at = datetime(year, month, day, hour, minute)
                    generated_at = timezone.make_aware(generated_at)
                    
                    return {
                        'product_code': product_code.upper(),
                        'generated_at': generated_at,
                        'file_format': filename.split('.')[-1].lower()
                    }
                except ValueError:
                    continue
        
        # Si no coincide con patrones conocidos, intentar extraer fecha genérica
        generic_pattern = r'(\d{4})(\d{2})(\d{2}).*?(\d{2})(\d{2})'
        match = re.search(generic_pattern, filename_lower)
        
        if match:
            year, month, day, hour, minute = map(int, match.groups())
            try:
                generated_at = datetime(year, month, day, hour, minute)
                generated_at = timezone.make_aware(generated_at)
                
                return {
                    'product_code': 'GENERIC',
                    'generated_at': generated_at,
                    'file_format': filename.split('.')[-1].lower()
                }
            except ValueError:
                pass
        
        return None
    
    def process_file(self, file_info):
        """Procesa un archivo individual"""
        filename = file_info['filename']
        
        # Obtener o crear tipo de producto
        product_type, _ = ProductType.objects.get_or_create(
            code=file_info['product_code'],
            defaults={
                'name': self.get_product_name(file_info['product_code']),
                'description': f'Producto meteorológico {file_info["product_code"]}',
                'color': self.get_product_color(file_info['product_code'])
            }
        )
        
        # Verificar si el producto ya existe
        existing = WeatherProduct.objects.filter(
            filename=filename,
            product_type=product_type
        ).first()
        
        if existing and not self.force:
            return 'exists'
        
        # Obtener información adicional del archivo
        file_size = self.get_file_size(file_info['url'])
        
        # Crear título descriptivo
        title = self.generate_title(file_info, product_type)
        
        # Datos del producto
        product_data = {
            'title': title,
            'product_type': product_type,
            'filename': filename,
            'file_url': file_info['url'],
            'file_format': file_info['file_format'],
            'file_size': file_size,
            'generated_at': file_info['generated_at'],
            'description': f'Producto {product_type.name} generado el {file_info["generated_at"].strftime("%Y-%m-%d %H:%M")}',
            'is_available': True,
        }
        
        if self.dry_run:
            self.stdout.write(f'[DRY RUN] Procesaría: {filename}')
            return 'dry_run'
        
        if existing:
            # Actualizar producto existente
            for key, value in product_data.items():
                if key != 'product_type':  # No actualizar la relación
                    setattr(existing, key, value)
            existing.save()
            return 'updated'
        else:
            # Crear nuevo producto
            WeatherProduct.objects.create(**product_data)
            return 'created'
    
    def get_file_size(self, url):
        """Obtiene el tamaño del archivo mediante HEAD request"""
        try:
            response = requests.head(url, timeout=10)
            return int(response.headers.get('content-length', 0))
        except:
            return None
    
    def get_product_name(self, code):
        """Retorna nombre descriptivo del producto"""
        names = {
            'FWI': 'Índice de Riesgo de Incendio',
            'RADAR': 'Imagen de Radar',
            'SATELITE': 'Imagen Satelital',
            'PRECIPITACION': 'Precipitación',
            'TEMPERATURA': 'Temperatura',
            'GENERIC': 'Producto Meteorológico'
        }
        return names.get(code, f'Producto {code}')
    
    def get_product_color(self, code):
        """Retorna color para el tipo de producto"""
        colors = {
            'FWI': '#EF4444',        # Rojo para riesgo de incendio
            'RADAR': '#10B981',      # Verde para radar
            'SATELITE': '#3B82F6',   # Azul para satélite
            'PRECIPITACION': '#0EA5E9', # Azul claro para precipitación
            'TEMPERATURA': '#F59E0B', # Naranja para temperatura
            'GENERIC': '#6B7280'     # Gris para genérico
        }
        return colors.get(code, '#6B7280')
    
    def generate_title(self, file_info, product_type):
        """Genera título descriptivo para el producto"""
        date_str = file_info['generated_at'].strftime('%d/%m/%Y %H:%M')
        return f"{product_type.name} - {date_str}"
