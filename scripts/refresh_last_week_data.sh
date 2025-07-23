#!/bin/bash

# Borra todos los productos meteorológicos
echo "Borrando todos los productos..."
python manage.py shell -c "from productos.models import Producto; Producto.objects.all().delete()"

# Sincroniza los datos de la última semana
# Debes implementar el comando 'sync_weather_data' para que acepte el parámetro --last-week
# Por ejemplo: python manage.py sync_weather_data --last-week
# Si no existe, deberás crear el management command correspondiente.
echo "Sincronizando datos de la última semana..."
python manage.py sync_weather_data --last-week

echo "¡Listo! Base de datos limpia y actualizada con la última semana." 