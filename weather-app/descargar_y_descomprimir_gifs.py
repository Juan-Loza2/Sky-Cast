import os
import requests
from PIL import Image
from io import BytesIO

# URL del único GIF válido
GIF_URL = "http://yaku.ohmc.ar/public/rutas_caminera/rafagas_rutas.gif"

# Directorio donde se guardarán los fotogramas
OUTPUT_DIR = os.path.join("frames", "RAFAGAS", "rafagas_rutas")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Nombre del archivo temporal
GIF_PATH = os.path.join(OUTPUT_DIR, "rafagas_rutas.gif")

def descargar_gif(url, destino):
    print(f"Descargando GIF desde {url}...")
    try:
        response = requests.get(url)
        if response.status_code == 200:
            with open(destino, "wb") as f:
                f.write(response.content)
            print("✅ GIF descargado correctamente.")
            return True
        else:
            print(f"❌ Error {response.status_code} al descargar el GIF.")
            return False
    except Exception as e:
        print(f"❌ Error al descargar: {e}")
        return False

def descomprimir_gif(path_gif, salida_dir):
    try:
        with Image.open(path_gif) as gif:
            for i in range(gif.n_frames):
                gif.seek(i)
                frame_path = os.path.join(salida_dir, f"frame_{i:03}.png")
                gif.convert("RGB").save(frame_path, "PNG")
            print(f"✅ {gif.n_frames} fotogramas guardados en: {salida_dir}")
    except Exception as e:
        print(f"❌ Error al descomprimir el GIF: {e}")

if __name__ == "__main__":
    if descargar_gif(GIF_URL, GIF_PATH):
        descomprimir_gif(GIF_PATH, OUTPUT_DIR)
