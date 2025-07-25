# 🌤️ OHMC Weather API - Sistema Meteorológico Completo

Sistema integral de gestión de productos meteorológicos con Django REST Framework, PostgreSQL, Redis, Celery y frontend React.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Paso a Paso](#-instalación-paso-a-paso)
- [Uso del Sistema](#-uso-del-sistema)
- [API Endpoints](#-api-endpoints)
- [Comandos Útiles](#-comandos-útiles)
- [Troubleshooting](#-troubleshooting)
- [Producción](#-producción)

## 🚀 Características

- **🔄 Sincronización automática** de datos meteorológicos del OHMC
- **📊 API REST completa** con filtros avanzados
- **🎨 Admin personalizado** con dashboard y estadísticas
- **⚛️ Frontend React moderno** con interfaz intuitiva
- **🐳 Containerización completa** con Docker
- **📅 Tareas programadas** con Celery y Redis
- **🗄️ Base de datos PostgreSQL** robusta
- **🌐 Interfaz responsive** para todos los dispositivos

## 🏗️ Arquitectura

\`\`\`
JSON (OHMC) → API Django → PostgreSQL → API REST → Frontend React
                ↓
            Celery + Redis (Tareas programadas)
\`\`\`

## 📋 Requisitos Previos

- **Docker** y **Docker Compose** instalados
- **Git** para clonar el repositorio
- **Node.js 18+** y **npm** (para el frontend)
- Al menos **4GB de RAM** disponible
- **Puertos libres**: 8000 (Django), 3000 (React), 5432 (PostgreSQL), 6379 (Redis)

## ⚡ Inicio rápido con start.sh

La forma más sencilla y recomendada de iniciar el proyecto es usando el script `start.sh`, que automatiza toda la instalación y configuración necesaria para el backend, frontend y la carga de datos meteorológicos (sin imágenes).

### 🏁 Pasos para iniciar el proyecto automáticamente

```bash
# 1. Da permisos de ejecución al script (solo la primera vez)
chmod +x start.sh

# 2. Ejecuta el script
./start.sh
```

### 🔍 ¿Qué hace el script start.sh?

1. **Verifica requisitos previos:** Comprueba que Docker, Docker Compose y Node.js estén instalados y funcionando.
2. **Limpia instalaciones anteriores:** Detiene y elimina contenedores previos, y limpia recursos de Docker.
3. **Configura variables de entorno:** Genera automáticamente el archivo `.env` necesario para Django y los servicios.
4. **Prepara la estructura de directorios:** Crea carpetas y archivos requeridos para comandos personalizados de Django.
5. **Construye y levanta los servicios Docker:** Backend, base de datos, Redis, etc.
6. **Espera a que la base de datos esté lista:** Antes de continuar, asegura que PostgreSQL esté disponible.
7. **Configura Django:** Elimina migraciones viejas, crea nuevas, aplica migraciones y genera un superusuario por defecto (`admin`/`admin123`).
8. **Carga los datos meteorológicos (sin imágenes):** Ejecuta los comandos personalizados para borrar y cargar datos básicos, sin descargar fotos.
9. **Configura el frontend (si tienes Node.js):** Instala dependencias de React y deja listo el frontend para iniciar.
10. **Verifica la instalación:** Comprueba que los servicios estén corriendo y que la API responda correctamente.
11. **Muestra información útil:** URLs, usuarios, comandos útiles y estadísticas del sistema.
12. **(Opcional) Pregunta si quieres iniciar el frontend automáticamente.**

---

## 🛠️ Instalación Paso a Paso

## 🚀 ¿Cómo lo levanto?

1. **Requisitos:**
   - Docker y Docker Compose
   - (Opcional) Node.js 18+ para el frontend

2. **Clona el repo:**
   ```bash
   git clone <repo-url>
   cd Sky-Cast
   ```

3. **Ejecuta el instalador:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

¡Listo! El script hace todo por vos: prepara la base, instala dependencias, carga datos y deja todo funcionando.

---

## 🌐 Acceso rápido

- API: [http://localhost:8000/api/](http://localhost:8000/api/)
- Admin: [http://localhost:8000/admin](http://localhost:8000/admin)
  - Usuario: `admin` / Contraseña: `admin123`
- Frontend: [http://localhost:3000](http://localhost:3000) (si tienes Node.js)

---

## 💡 ¿Qué incluye?
- Backend Django + PostgreSQL
- Frontend React (opcional)
- Redis y Celery para tareas
- Carga automática de datos meteorológicos (sin imágenes)

---

## 📬 Contacto
¿Dudas o sugerencias? Escribí a tu-email@ejemplo.com

---

✨ ¡Listo para usar y modificar! ✨

## 🎯 Uso del Sistema

### 🔧 Panel de Administración

1. Ve a http://localhost:8000/admin
2. Inicia sesión con `admin` / `admin123`
3. Explora las secciones:
   - **📊 Dashboard**: Estadísticas generales
   - **🌡️ Tipos de Producto**: WRF, FWI, Gases, Rutas
   - **📄 Productos**: Archivos individuales con imágenes
   - **📅 Fechas de Productos**: Historial temporal

### ⚛️ Frontend React

1. Ve a http://localhost:3000
2. Navega entre las pestañas:
   - **🌡️ WRF**: Selecciona fecha, hora y variable meteorológica
   - **🔥 FWI**: Índice de peligro de incendio
   - **🌬️ Gases**: Mediciones de CO₂ y CH₄ (selecciona fecha)
   - **🛣️ Vientos**: Ráfagas en rutas provinciales

## 📊 API Endpoints

### Endpoints Principales

| Método | Endpoint | Descripción | Ejemplo |
|--------|----------|-------------|---------|
| `GET` | `/api/productos/` | Lista todos los productos | `?tipo=wrf_cba&fecha=2025-06-30` |
| `GET` | `/api/productos/{id}/` | Detalle de un producto | `/api/productos/1/` |
| `GET` | `/api/tipos/` | Lista tipos de productos | - |
| `GET` | `/api/ultimos/` | Últimos productos por tipo | - |
| `GET` | `/api/estadisticas/` | Estadísticas generales | - |
| `GET` | `/api/productos/fecha-hora/` | WRF por fecha/hora específica | `?fecha=2025-06-30&hora=12:00` |

