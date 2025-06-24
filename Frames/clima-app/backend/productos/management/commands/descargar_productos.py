import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from django.core.management.base import BaseCommand
from productos.models import Producto
from django.core.files.base import ContentFile
from urllib.parse import urljoin


class Command(BaseCommand):
    help = 'Descarga productos desde URLs específicas y guarda en la base de datos'

    URLS = {
        'FWI': 'http://yaku.ohmc.ar/public/FWI/',
        'GEI': 'http://yaku.ohmc.ar/public/MedicionAire/',
        'RAFAGA': 'http://yaku.ohmc.ar/public/rutas_caminera/',
        'WRF': 'http://yaku.ohmc.ar/public/wrf/img/CENTRO/A/',
    }

    def handle(self, *args, **options):
        for tipo, base_url in self.URLS.items():
            self.stdout.write(f'Descargando productos tipo {tipo} desde {base_url}')
            response = requests.get(base_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            links = [a['href'] for a in soup.find_all('a', href=True)]

            for link in links:
                if any(link.lower().endswith(ext) for ext in ['.jpg', '.png', '.gif']):
                    nombre = os.path.basename(link)
                    # Check if product exists
                    if Producto.objects.filter(tipo=tipo, nombre=nombre).exists():
                        self.stdout.write(f'Producto {nombre} de tipo {tipo} ya existe. Omitiendo.')
                        continue

                    file_url = urljoin(base_url, link)
                    # Download file
                    file_response = requests.get(file_url)
                    file_response.raise_for_status()

                    # Save file to model
                    producto = Producto(
                        tipo=tipo,
                        nombre=nombre,
                        fecha=datetime.now().date(),
                        url=file_url
                    )
                    producto.archivo.save(nombre, ContentFile(file_response.content), save=False)
                    producto.save()
                    self.stdout.write(f'Producto {nombre} de tipo {tipo} guardado.')

        self.stdout.write('Descarga completada.')
