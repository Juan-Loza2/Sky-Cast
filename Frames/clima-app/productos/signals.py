from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.core.management import call_command

@receiver(post_migrate)
def download_products(sender, **kwargs):
    """Signal que se activa después de las migraciones y descarga los productos"""
    print("\nIniciando descarga automática de productos...")
    call_command('descargar_productos')
