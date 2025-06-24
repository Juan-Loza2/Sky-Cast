import requests
from datetime import datetime, timedelta

BASE_URLS = {
    "FWI": "http://yaku.ohmc.ar/public/FWI/fwi_{date}.gif",
    "GEI": "http://yaku.ohmc.ar/public/MedicionAire/gei_{date}.gif",
    "RAFAGAS": "http://yaku.ohmc.ar/public/rutas_caminera/rafagas_{date}.gif",
    "WRF": "http://yaku.ohmc.ar/public/wrf/img/CENTRO/A/wrf_{date}.gif",
}

def encontrar_urls_validas(dias=7):
    hoy = datetime.utcnow()
    urls_encontradas = []
    for categoria, url_template in BASE_URLS.items():
        for i in range(dias):
            fecha = (hoy - timedelta(days=i)).strftime("%Y%m%d")
            url = url_template.format(date=fecha)
            resp = requests.head(url)
            if resp.status_code == 200:
                print(f"[OK] {categoria} – {url}")
                urls_encontradas.append((categoria, url))
            else:
                print(f"[404] {categoria} – {url}")
    return urls_encontradas

if __name__ == "__main__":
    valids = encontrar_urls_validas(14)
    print("URLs encontradas:", valids)