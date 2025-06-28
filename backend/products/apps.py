
from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'products'
    verbose_name = 'Productos Meteorológicos'
    
    def ready(self):
        # Importar señales si las necesitamos
        pass
