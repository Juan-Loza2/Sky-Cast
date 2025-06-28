
from django.db import models
from django.utils import timezone


class ProductType(models.Model):
    """Tipo de producto meteorológico (FWI, Radar, Satélite, etc.)"""
    
    code = models.CharField(max_length=10, unique=True, help_text="Código del tipo (ej: FWI, RAD)")
    name = models.CharField(max_length=100, help_text="Nombre descriptivo del tipo")
    description = models.TextField(blank=True, help_text="Descripción detallada del producto")
    color = models.CharField(max_length=7, default="#3B82F6", help_text="Color hex para la interfaz")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Tipo de Producto"
        verbose_name_plural = "Tipos de Productos"

    def __str__(self):
        return f"{self.code} - {self.name}"


class WeatherProduct(models.Model):
    """Producto meteorológico individual"""
    
    title = models.CharField(max_length=200, help_text="Título del producto")
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE, related_name='products')
    
    # File information
    filename = models.CharField(max_length=255, help_text="Nombre del archivo original")
    file_url = models.URLField(help_text="URL completa del archivo en el servidor OHMC")
    file_size = models.PositiveIntegerField(null=True, blank=True, help_text="Tamaño del archivo en bytes")
    file_format = models.CharField(max_length=10, help_text="Formato del archivo (gif, png, jpg)")
    
    # Temporal information
    generated_at = models.DateTimeField(help_text="Fecha y hora de generación del producto")
    valid_from = models.DateTimeField(null=True, blank=True, help_text="Válido desde")
    valid_until = models.DateTimeField(null=True, blank=True, help_text="Válido hasta")
    
    # Metadata
    description = models.TextField(blank=True, help_text="Descripción del producto")
    region = models.CharField(max_length=100, blank=True, help_text="Región geográfica")
    resolution = models.CharField(max_length=50, blank=True, help_text="Resolución espacial")
    
    # System fields
    is_available = models.BooleanField(default=True, help_text="Disponible para visualización")
    last_checked = models.DateTimeField(auto_now=True, help_text="Última verificación de disponibilidad")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-generated_at', '-created_at']
        unique_together = ['filename', 'product_type']
        verbose_name = "Producto Meteorológico"
        verbose_name_plural = "Productos Meteorológicos"
        indexes = [
            models.Index(fields=['generated_at']),
            models.Index(fields=['product_type', 'generated_at']),
            models.Index(fields=['is_available', 'generated_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.generated_at.strftime('%Y-%m-%d %H:%M')}"

    @property
    def is_current(self):
        """Verifica si el producto está dentro de su período de validez"""
        now = timezone.now()
        if self.valid_from and self.valid_until:
            return self.valid_from <= now <= self.valid_until
        return True

    @property
    def age_hours(self):
        """Retorna la antigüedad del producto en horas"""
        now = timezone.now()
        delta = now - self.generated_at
        return round(delta.total_seconds() / 3600, 1)

    def get_thumbnail_url(self):
        """Retorna URL para thumbnail si está disponible"""
        if self.file_format.lower() in ['gif']:
            # Para GIFs, podríamos generar un thumbnail estático
            return self.file_url.replace('.gif', '_thumb.png')
        return self.file_url


class ProductCollection(models.Model):
    """Colección de productos relacionados (ej: secuencia animada)"""
    
    name = models.CharField(max_length=200)
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)
    products = models.ManyToManyField(WeatherProduct, related_name='collections')
    
    description = models.TextField(blank=True)
    is_animation = models.BooleanField(default=False, help_text="Es una secuencia animada")
    animation_speed = models.PositiveIntegerField(default=500, help_text="Velocidad de animación en ms")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Colección de Productos"
        verbose_name_plural = "Colecciones de Productos"

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        return self.products.count()

    @property
    def latest_product_date(self):
        latest = self.products.order_by('-generated_at').first()
        return latest.generated_at if latest else None
