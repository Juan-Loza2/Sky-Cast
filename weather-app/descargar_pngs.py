import os
import requests

CARPETA_BASE = r"D:\Users\emima\Downloads\Sky-Cast\weather-app\frames"

URLS = {
    "FWI":    "http://yaku.ohmc.ar/public/FWI/FWI.png",
    "GEI":    "http://yaku.ohmc.ar/public/MedicionAire/GEI.png",
    "RAFAGAS":"http://yaku.ohmc.ar/public/rutas_caminera/RAFAGAS.png",
    "WRF":    "http://yaku.ohmc.ar/public/wrf/img/CENTRO/A/WRF.png"
}

def descargar_imagen(categoria, url):
    carpeta_destino = os.path.join(CARPETA_BASE, categoria)
    os.makedirs(carpeta_destino, exist_ok=True)
    nombre_archivo = url.split("/")[-1]
    ruta_local = os.path.join(carpeta_destino, nombre_archivo)

    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            with open(ruta_local, "wb") as f:
                f.write(r.content)
            print(f"✅ Descargado: {ruta_local}")
        else:
            print(f"❌ Error {r.status_code} al descargar {url}")
    except Exception as e:
        print(f"⚠️ Error al descargar {url}: {e}")

if __name__ == "__main__":
    for categoria, url in URLS.items():
        descargar_imagen(categoria, url)