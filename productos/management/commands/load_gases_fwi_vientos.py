from django.core.management.base import BaseCommand
from productos.models import Producto, TipoProducto, FechaProducto
from datetime import date, timedelta, time

class Command(BaseCommand):
    help = 'Carga registros de Gases, FWI y Vientos para un rango de días en la base de datos.'

    def add_arguments(self, parser):
        parser.add_argument('--dias', type=int, default=1, help='Cantidad de días hacia atrás a cargar (incluye hoy)')

    def handle(self, *args, **options):
        dias = options['dias']
        hoy = date.today()
        for delta in range(dias):
            d = hoy - timedelta(days=delta)
            month = f"{d.month:02d}"
            day = f"{d.day:02d}"

            # Gases
            tipo_gas, _ = TipoProducto.objects.get_or_create(nombre="MedicionAire")
            for var, filename in [("CO2", "CO2_webvisualizer_v4.png"), ("CH4", "CH4_webvisualizer_v4.png")]:
                url = f"https://yaku.ohmc.ar/public/sensado/analizadorGHG/{month}/{day}/{filename}"
                producto, _ = Producto.objects.get_or_create(
                    tipo_producto=tipo_gas,
                    variable=var,
                    nombre_archivo=filename,
                    url_imagen=url,
                )
                fecha_obj, created = FechaProducto.objects.get_or_create(
                    fecha=d,
                    hora=time(10, 30),
                    producto=producto
                )
                if created:
                    self.stdout.write(f"FechaProducto creada para {producto} - {d} 10:30")
                else:
                    self.stdout.write(f"FechaProducto ya existía para {producto} - {d} 10:30")

            # FWI
            tipo_fwi, _ = TipoProducto.objects.get_or_create(nombre="FWI")
            url_fwi = "https://wrf.ohmc.ar/img/CENTRO/FWI.png"
            producto_fwi, _ = Producto.objects.get_or_create(
                tipo_producto=tipo_fwi,
                variable="FWI",
                nombre_archivo="FWI.png",
                url_imagen=url_fwi,
            )
            fecha_obj, created = FechaProducto.objects.get_or_create(
                fecha=d,
                hora=time(12, 0),
                producto=producto_fwi
            )
            if created:
                self.stdout.write(f"FechaProducto creada para FWI - {d} 12:00")
            else:
                self.stdout.write(f"FechaProducto ya existía para FWI - {d} 12:00")

            # Vientos (Ráfagas)
            tipo_viento, _ = TipoProducto.objects.get_or_create(nombre="rafagas")
            for nombre, archivo, hora_v in [("rafaga_06", "rafaga_06.gif", time(6, 0)), ("rafaga_18", "rafaga_18.gif", time(18, 0))]:
                url = f"https://yaku.ohmc.ar/public/pronosticos/VIENTOS/{archivo}"
                producto, _ = Producto.objects.get_or_create(
                    tipo_producto=tipo_viento,
                    variable=nombre,
                    nombre_archivo=archivo,
                    url_imagen=url,
                )
                fecha_obj, created = FechaProducto.objects.get_or_create(
                    fecha=d,
                    hora=hora_v,
                    producto=producto
                )
                if created:
                    self.stdout.write(f"FechaProducto creada para {nombre} - {d} {hora_v}")
                else:
                    self.stdout.write(f"FechaProducto ya existía para {nombre} - {d} {hora_v}")

            # Vientos en rutas
            tipo_rutas, _ = TipoProducto.objects.get_or_create(nombre="rutas_caminera")
            url_rutas = "https://yaku.ohmc.ar/public/pronosticos/VIENTOS/VIENTOS_en_RUTAS/rafagas_rutas.gif"
            producto_rutas, _ = Producto.objects.get_or_create(
                tipo_producto=tipo_rutas,
                variable="rafagas_rutas",
                nombre_archivo="rafagas_rutas.gif",
                url_imagen=url_rutas,
            )
            fecha_obj, created = FechaProducto.objects.get_or_create(
                fecha=d,
                hora=time(11, 0),
                producto=producto_rutas
            )
            if created:
                self.stdout.write(f"FechaProducto creada para rutas_caminera - {d} 11:00")
            else:
                self.stdout.write(f"FechaProducto ya existía para rutas_caminera - {d} 11:00")

        self.stdout.write(self.style.SUCCESS(f"Registros de Gases, FWI y Vientos cargados para los últimos {dias} días.")) 