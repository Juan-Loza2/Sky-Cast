import os
import requests

# Carpeta base del servidor remoto
base_url = "http://yaku.ohmc.ar/public/MedicionAire"

# Carpeta base local donde guardar
local_base = "frames/MedicionAire"

# Carpetas principales a recorrer (p.ej: "04", "05", "06")
carpetas_principales = ["04", "05", "06"]

# Archivos que están en cada subcarpeta a descargar
archivos = [
    "CH4_webvisualizer_v2.png",
    "CO2_webvisualizer_v2.png",
    "H2O_webvisualizer_v2.png"
]

# Para no hardcodear el rango 01-31, podemos intentar bajarlos y en caso de error saltar
# Pero si querés podés definir el rango fijo:
subcarpetas = [f"{i:02d}" for i in range(1, 32)]  # 01 a 31

def descargar_imagen(url, ruta_local):
    try:
        respuesta = requests.get(url, timeout=10)
        if respuesta.status_code == 200:
            with open(ruta_local, 'wb') as f:
                f.write(respuesta.content)
            print(f"✅ Descargado: {ruta_local}")
            return True
        else:
            print(f"❌ Error {respuesta.status_code} al descargar {url}")
            return False
    except Exception as e:
        print(f"❌ Error al descargar {url}: {e}")
        return False

for carpeta_principal in carpetas_principales:
    for subcarpeta in subcarpetas:
        for archivo in archivos:
            url = f"{base_url}/{carpeta_principal}/{subcarpeta}/{archivo}"
            carpeta_local = os.path.join(local_base, carpeta_principal, subcarpeta)
            os.makedirs(carpeta_local, exist_ok=True)
            ruta_local = os.path.join(carpeta_local, archivo)
            descargar_imagen(url, ruta_local)
