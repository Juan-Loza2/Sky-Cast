
# OHMC Weather Viewer

Aplicación móvil para visualizar productos meteorológicos del Observatorio Hidrometeorológico de Córdoba (OHMC).

## 🏗️ Arquitectura

- **Frontend**: React Native
- **Backend**: Django REST Framework
- **Base de datos**: PostgreSQL
- **Containerización**: Docker + Docker Swarm
- **Infraestructura**: Clúster Proxmox

## 🚀 Inicio rápido

### Desarrollo local

```bash
# Clonar el repositorio
git clone <repository-url>
cd ohmc-weather-viewer

# Levantar servicios con Docker Compose
docker-compose up -d

# La API estará disponible en http://localhost:8000
# El frontend se debe ejecutar por separado (ver sección Frontend)
```

### Producción con Docker Swarm

```bash
# Inicializar Docker Swarm (si no está inicializado)
docker swarm init

# Desplegar el stack
docker stack deploy -c swarm-stack.yml ohmc-weather

# Verificar servicios
docker service ls
```

## 📁 Estructura del proyecto

```
├── backend/                 # Django REST API
│   ├── ohmc_api/           # Aplicación principal
│   ├── products/           # App de productos meteorológicos
│   ├── requirements.txt    # Dependencias Python
│   └── Dockerfile         # Imagen Docker del backend
├── frontend/               # React Native app
│   ├── src/               # Código fuente
│   ├── android/           # Configuración Android
│   ├── ios/               # Configuración iOS
│   └── package.json       # Dependencias Node.js
├── docker-compose.yml      # Desarrollo local
├── swarm-stack.yml        # Producción Docker Swarm
└── README.md              # Este archivo
```

## 🔧 Configuración

### Variables de entorno

Crear archivo `.env` en la raíz:

```env
# Database
POSTGRES_DB=ohmc_weather
POSTGRES_USER=ohmc_user
POSTGRES_PASSWORD=secure_password_here

# Django
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# OHMC Data Source
OHMC_PUBLIC_URL=http://yaku.ohmc.ar/public/
```

## 📱 Frontend (React Native)

```bash
cd frontend
npm install

# Para Android
npm run android

# Para iOS
npm run ios
```

## 🛠️ Backend (Django)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instalar dependencias
pip install -r requirements.txt

# Migrar base de datos
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

## 📊 Endpoints API

- `GET /api/productos/` - Lista todos los productos
- `GET /api/productos?tipo=FWI` - Filtrar por tipo
- `GET /api/productos?fecha=2024-01-01` - Filtrar por fecha
- `GET /api/ultimos/` - Últimos productos disponibles
- `GET /api/tipos/` - Lista de tipos de productos

## 🔄 Carga automática de datos

El sistema incluye un comando de Django para sincronizar datos:

```bash
# Ejecutar manualmente
python manage.py sync_ohmc_data

# Configurar como cronjob (cada hora)
0 * * * * cd /path/to/project && python manage.py sync_ohmc_data
```

## 🐳 Docker

### Desarrollo
```bash
docker-compose up -d
```

### Producción
```bash
docker stack deploy -c swarm-stack.yml ohmc-weather
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
