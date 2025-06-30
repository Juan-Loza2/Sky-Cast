from celery import shared_task
from django.utils import timezone
from datetime import datetime, timedelta, date
import requests
import json
from .models import TipoProducto, Producto, FechaProducto
import logging

logger = logging.getLogger(__name__)

@shared_task
def sync_wrf_data():
    """Sincronizar datos WRF del último mes con estructura correcta"""
    try:
        # Crear o obtener tipo de producto
        tipo_wrf, created = TipoProducto.objects.get_or_create(
            nombre='wrf_cba',
            defaults={
                'descripcion': 'Productos horarios generados por el modelo WRF para Córdoba',
                'url': 'https://yaku.ohmc.ar/public/wrf/img/CBA/'
            }
        )
        
        # Variables disponibles según la estructura real del servidor
        variables = [
            'cl', 'ctt', 'dbz_altura', 'hail', 'max_dbz', 'mcape',
            'ppn', 'ppnaccum', 'rh2', 'riesgos_vientos', 'snow',
            't2', 'wdir10', 'wspd10', 'wspd_altura'
        ]
        
        # Obtener datos del último mes
        hoy = date.today()
        productos_creados = 0
        
        for dias_atras in range(30):  # Último mes
            fecha_actual = hoy - timedelta(days=dias_atras)
            
            # Solo procesar días con corridas (6 y 18 UTC)
            for hora_corrida in ['06', '18']:
                for variable in variables:
                    # Generar URLs para las próximas 24 horas de pronóstico
                    for hora_pronostico in range(0, 25, 3):  # Cada 3 horas
                        hora_str = f"{hora_pronostico:02d}"
                        
                        # Estructura de URL basada en la estructura real del servidor
                        url = f"https://yaku.ohmc.ar/public/wrf/img/CBA/{fecha_actual.year}_{fecha_actual.month:02d}/{fecha_actual.day:02d}_{hora_corrida}/{variable}/{variable}-{fecha_actual.strftime('%Y-%m-%d')}_{hora_corrida}+{hora_str}.png"
                        
                        nombre_archivo = f"{variable}-{fecha_actual.strftime('%Y-%m-%d')}_{hora_corrida}+{hora_str}.png"
                        
                        # Crear o actualizar producto
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
                        
                        # Crear fecha de producto
                        try:
                            # Calcular la hora real del pronóstico
                            hora_inicio = int(hora_corrida)
                            hora_pronostico_real = (hora_inicio + hora_pronostico) % 24
                            hora_obj = datetime.strptime(f"{hora_pronostico_real:02d}:00", "%H:%M").time()
                            
                            FechaProducto.objects.get_or_create(
                                fecha=fecha_actual,
                                hora=hora_obj,
                                producto=producto
                            )
                        except Exception as e:
                            logger.warning(f"Error creando fecha para {nombre_archivo}: {str(e)}")
                            continue
        
        logger.info(f"Sincronización WRF completada: {productos_creados} productos nuevos")
        return f"WRF sync completed: {productos_creados} new products"
        
    except Exception as e:
        logger.error(f"Error en sincronización WRF: {str(e)}")
        raise

@shared_task
def sync_medicion_aire():
    """Sincronizar datos de medición de aire del último mes"""
    try:
        tipo_aire, created = TipoProducto.objects.get_or_create(
            nombre='MedicionAire',
            defaults={
                'descripcion': 'Visualizaciones diarias de gases de efecto invernadero',
                'url': 'https://yaku.ohmc.ar/public/MedicionAire/'
            }
        )
        
        archivos = ['CH4_webvisualizer_v4.png', 'CO2_webvisualizer_v4.png']
        hoy = date.today()
        productos_creados = 0
        
        for dias_atras in range(30):  # Último mes
            fecha_actual = hoy - timedelta(days=dias_atras)
            
            for archivo in archivos:
                url = f"https://yaku.ohmc.ar/public/MedicionAire/{fecha_actual.month:02d}/{fecha_actual.day:02d}/{archivo}"
                
                producto, created = Producto.objects.get_or_create(
                    tipo_producto=tipo_aire,
                    nombre_archivo=archivo,
                    defaults={'url_imagen': url}
                )
                
                if not created:
                    producto.url_imagen = url
                    producto.save()
                else:
                    productos_creados += 1
                
                # Crear fecha (aproximadamente a las 10:30)
                FechaProducto.objects.get_or_create(
                    fecha=fecha_actual,
                    hora=datetime.strptime("10:30", "%H:%M").time(),
                    producto=producto
                )
        
        logger.info(f"Sincronización MedicionAire completada: {productos_creados} productos nuevos")
        return f"MedicionAire sync completed: {productos_creados} new products"
        
    except Exception as e:
        logger.error(f"Error en sincronización MedicionAire: {str(e)}")
        raise

@shared_task
def sync_fwi_data():
    """Sincronizar datos FWI"""
    try:
        tipo_fwi, created = TipoProducto.objects.get_or_create(
            nombre='FWI',
            defaults={
                'descripcion': 'Índice meteorológico de peligro de incendio',
                'url': 'https://yaku.ohmc.ar/public/FWI/'
            }
        )
        
        url = "https://yaku.ohmc.ar/public/FWI/FWI.png"
        
        producto, created = Producto.objects.get_or_create(
            tipo_fwi=tipo_fwi,
            nombre_archivo='FWI.png',
            defaults={'url_imagen': url}
        )
        
        if not created:
            producto.url_imagen = url
            producto.save()
        
        # Crear fecha de hoy
        FechaProducto.objects.get_or_create(
            fecha=date.today(),
            hora=datetime.strptime("11:00", "%H:%M").time(),
            producto=producto
        )
        
        logger.info("Sincronización FWI completada")
        return "FWI sync completed"
        
    except Exception as e:
        logger.error(f"Error en sincronización FWI: {str(e)}")
        raise

@shared_task
def sync_rutas_caminera():
    """Sincronizar datos de rutas caminera"""
    try:
        tipo_rutas, created = TipoProducto.objects.get_or_create(
            nombre='rutas_caminera',
            defaults={
                'descripcion': 'Animación de ráfagas de viento sobre rutas provinciales',
                'url': 'https://yaku.ohmc.ar/public/rutas_caminera/'
            }
        )
        
        url = "https://yaku.ohmc.ar/public/rutas_caminera/rafagas_rutas.gif"
        
        producto, created = Producto.objects.get_or_create(
            tipo_producto=tipo_rutas,
            nombre_archivo='rafagas_rutas.gif',
            defaults={'url_imagen': url}
        )
        
        if not created:
            producto.url_imagen = url
            producto.save()
        
        FechaProducto.objects.get_or_create(
            fecha=date.today(),
            hora=datetime.strptime("11:00", "%H:%M").time(),
            producto=producto
        )
        
        logger.info("Sincronización rutas_caminera completada")
        return "Rutas caminera sync completed"
        
    except Exception as e:
        logger.error(f"Error en sincronización rutas_caminera: {str(e)}")
        raise

@shared_task
def sync_all_data():
    """Ejecutar todas las sincronizaciones"""
    results = []
    
    try:
        # Ejecutar sincronizaciones secuencialmente para evitar problemas
        results.append(sync_wrf_data())
        results.append(sync_medicion_aire())
        results.append(sync_fwi_data())
        results.append(sync_rutas_caminera())
        
        logger.info("Todas las sincronizaciones completadas")
        return results
        
    except Exception as e:
        logger.error(f"Error en sincronización general: {str(e)}")
        raise
