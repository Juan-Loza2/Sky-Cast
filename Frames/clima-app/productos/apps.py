from django.apps import AppConfig
from . import signals

class ProductosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'productos'
    verbose_name = 'Productos'

    def ready(self):
        import productos.signals
