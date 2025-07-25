from django.core.management.base import BaseCommand
from productos.models import Producto, TipoProducto, FechaProducto
from datetime import date, timedelta, time

class Command(BaseCommand):
    help = 'Carga datos de FWI, vientos, medición aire y WRF (todas las variables) para el último mes.'

    def handle(self, *args, **options):
        hoy = date.today()
        dias = 30

        # 1. FWI
        tipo_fwi, _ = TipoProducto.objects.get_or_create(nombre="FWI")
        url_fwi = "https://wrf.ohmc.ar/img/CENTRO/FWI.png"
        for delta in range(dias):
            d = hoy - timedelta(days=delta)
            producto_fwi, _ = Producto.objects.get_or_create(
                tipo_producto=tipo_fwi,
                variable="FWI",
                nombre_archivo="FWI.png",
                url_imagen=url_fwi,
            )
            FechaProducto.objects.get_or_create(
                fecha=d,
                hora=time(12, 0),
                producto=producto_fwi
            )

        # 2. Vientos (Ráfagas y rutas)
        tipo_viento, _ = TipoProducto.objects.get_or_create(nombre="rafagas")
        for delta in range(dias):
            d = hoy - timedelta(days=delta)
            for nombre, archivo, hora_v in [("rafaga_06", "rafaga_06.gif", time(6, 0)), ("rafaga_18", "rafaga_18.gif", time(18, 0))]:
                url = f"https://yaku.ohmc.ar/public/pronosticos/VIENTOS/{archivo}"
                producto, _ = Producto.objects.get_or_create(
                    tipo_producto=tipo_viento,
                    variable=nombre,
                    nombre_archivo=archivo,
                    url_imagen=url,
                )
                FechaProducto.objects.get_or_create(
                    fecha=d,
                    hora=hora_v,
                    producto=producto
                )
        tipo_rutas, _ = TipoProducto.objects.get_or_create(nombre="rutas_caminera")
        url_rutas = "https://yaku.ohmc.ar/public/pronosticos/VIENTOS/VIENTOS_en_RUTAS/rafagas_rutas.gif"
        for delta in range(dias):
            d = hoy - timedelta(days=delta)
            producto_rutas, _ = Producto.objects.get_or_create(
                tipo_producto=tipo_rutas,
                variable="rafagas_rutas",
                nombre_archivo="rafagas_rutas.gif",
                url_imagen=url_rutas,
            )
            FechaProducto.objects.get_or_create(
                fecha=d,
                hora=time(11, 0),
                producto=producto_rutas
            )

        # 3. Medición Aire (Gases)
        tipo_gas, _ = TipoProducto.objects.get_or_create(nombre="MedicionAire")
        for delta in range(dias):
            d = hoy - timedelta(days=delta)
            month = f"{d.month:02d}"
            day = f"{d.day:02d}"
            for var, filename in [("CO2", "CO2_webvisualizer_v4.png"), ("CH4", "CH4_webvisualizer_v4.png")]:
                url = f"https://yaku.ohmc.ar/public/sensado/analizadorGHG/{month}/{day}/{filename}"
                producto, _ = Producto.objects.get_or_create(
                    tipo_producto=tipo_gas,
                    variable=var,
                    nombre_archivo=filename,
                    url_imagen=url,
                )
                FechaProducto.objects.get_or_create(
                    fecha=d,
                    hora=time(10, 30),
                    producto=producto
                )

        # 4. WRF (todas las variables, cada 3 horas, para el último mes)
        wrf_variables = [
            "t2", "ppnaccum", "rh2", "max_dbz", "wdir10", "wspd10"
        ]
        tipo_wrf, _ = TipoProducto.objects.get_or_create(nombre="wrf_cba")
        # Para cada día, dos corridas: 18 UTC (para la mañana siguiente) y 06 UTC (para la tarde)
        for delta in range(dias):
            d = hoy - timedelta(days=delta)
            yyyy = d.year
            mm = f"{d.month:02d}"
            dd = f"{d.day:02d}"
            # Corrida 18 UTC (para la mañana siguiente)
            base_date = d - timedelta(days=1)
            yyyy_prev = base_date.year
            mm_prev = f"{base_date.month:02d}"
            dd_prev = f"{base_date.day:02d}"
            for var in wrf_variables:
                for offset in range(9, 21, 3):  # 09, 12, ..., 20 (hasta 11:00)
                    hora_arg = offset - 9  # 00, 03, ..., 11
                    url = f"https://yaku.ohmc.ar/public/wrf/img/CBA/{yyyy_prev}_{mm_prev}/{dd_prev}_18/{var}/{var}-{yyyy_prev}-{mm_prev}-{dd_prev}_18+{offset:02d}.png"
                    nombre_archivo = f"{var}-{yyyy_prev}-{mm_prev}-{dd_prev}_18+{offset:02d}.png"
                    producto, _ = Producto.objects.get_or_create(
                        tipo_producto=tipo_wrf,
                        variable=var,
                        nombre_archivo=nombre_archivo,
                        url_imagen=url,
                    )
                    FechaProducto.objects.get_or_create(
                        fecha=d,
                        hora=time(hora_arg, 0),
                        producto=producto
                    )
            # Corrida 06 UTC (para la tarde)
            for var in wrf_variables:
                for offset in range(9, 22, 3):  # 09, 12, ..., 21 (hasta 21:00)
                    hora_arg = offset - 9 + 12  # 12, 15, ..., 21
                    if hora_arg > 21:
                        continue  # No crear para 24:00
                    url = f"https://yaku.ohmc.ar/public/wrf/img/CBA/{yyyy}_{mm}/{dd}_06/{var}/{var}-{yyyy}-{mm}-{dd}_06+{offset:02d}.png"
                    nombre_archivo = f"{var}-{yyyy}-{mm}-{dd}_06+{offset:02d}.png"
                    producto, _ = Producto.objects.get_or_create(
                        tipo_producto=tipo_wrf,
                        variable=var,
                        nombre_archivo=nombre_archivo,
                        url_imagen=url,
                    )
                    FechaProducto.objects.get_or_create(
                        fecha=d,
                        hora=time(hora_arg, 0),
                        producto=producto
                    )
        self.stdout.write(self.style.SUCCESS('¡Datos de todos los tipos cargados para el último mes!')) 