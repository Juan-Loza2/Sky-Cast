from django.db import models

class Producto(models.Model):
    TIPO_CHOICES = [
        ('FWI', 'FWI'),
        ('GEI', 'GEI'),
        ('RAFAGA', 'RAFAGA'),
        ('WRF', 'WRF'),
    ]

    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    nombre = models.CharField(max_length=255)
    fecha = models.DateField()
    url = models.URLField()
    archivo = models.FileField(upload_to='productos/')
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tipo', 'nombre')

    def __str__(self):
        return f"{self.tipo} - {self.nombre}"
