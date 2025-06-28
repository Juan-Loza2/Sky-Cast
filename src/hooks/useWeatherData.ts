
import { useState, useEffect } from 'react';

interface WeatherDataConfig {
  actualizaciones: {
    [key: string]: {
      frecuencia: {
        descripcion: string;
        cron_utc: string;
      };
      ultima_actualizacion: string;
    };
  };
}

interface WeatherProject {
  descripcion: string;
  url_base: string;
  tipo: string;
  frecuencia_actualizacion: string;
  ultima_actualizacion: string;
  estructura_directorios?: string;
  estructura_archivos?: string;
  archivos?: string[];
  variables_disponibles?: {
    [key: string]: {
      nombre: string;
      descripcion: string;
    };
  };
  ejemplo?: string;
  ejemplos?: string[];
}

interface WeatherRoutes {
  base_url: string;
  proyectos: {
    [key: string]: WeatherProject;
  };
}

export const useWeatherData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Configuración de actualización basada en tu JSON
  const updateConfig: WeatherDataConfig = {
    actualizaciones: {
      wrf_cba: {
        frecuencia: {
          descripcion: "dos veces al día (06 y 18 UTC)",
          cron_utc: "0 6,18 * * *"
        },
        ultima_actualizacion: "2025-06-26T09:35:00Z"
      },
      MedicionAire: {
        frecuencia: {
          descripcion: "diaria (aprox. 10:30 h)",
          cron_utc: "30 10 * * *"
        },
        ultima_actualizacion: "2025-06-26T10:31:00Z"
      },
      FWI: {
        frecuencia: {
          descripcion: "diaria (aprox. 11:00 h)",
          cron_utc: "0 11 * * *"
        },
        ultima_actualizacion: "2025-04-23T10:54:00Z"
      },
      rutas_caminera: {
        frecuencia: {
          descripcion: "diaria (aprox. 11:00 h)",
          cron_utc: "0 11 * * *"
        },
        ultima_actualizacion: "2025-04-23T10:51:00Z"
      }
    }
  };

  // Rutas de datos basadas en tu JSON
  const routesConfig: WeatherRoutes = {
    base_url: "https://yaku.ohmc.ar/public/",
    proyectos: {
      wrf_cba: {
        descripcion: "Productos horarios generados por el modelo WRF para Córdoba, con actualizaciones diarias y dos corridas por día.",
        url_base: "https://yaku.ohmc.ar/public/wrf/img/CBA/",
        estructura_directorios: "CBA/YYYY_MM/DD_HH/{variable}/",
        estructura_archivos: "{variable}-YYYY-MM-DD_HH+HH.png",
        tipo: "imágenes dinámicas con estructura de directorios",
        frecuencia_actualizacion: "diaria - dos corridas por día",
        ultima_actualizacion: "2025-06-26T12:00:00Z",
        variables_disponibles: {
          t2: {
            nombre: "Temperatura a 2 metros",
            descripcion: "Temperatura del aire a 2 metros sobre el suelo (°C)."
          },
          ppn: {
            nombre: "Precipitación horaria",
            descripcion: "Tasa instantánea de precipitación (mm/h)."
          },
          wspd10: {
            nombre: "Velocidad del viento a 10 metros",
            descripcion: "Velocidad del viento (m/s) a 10 m de altura."
          },
          rh2: {
            nombre: "Humedad relativa a 2 metros",
            descripcion: "Porcentaje de humedad relativa a 2 metros sobre la superficie."
          }
        }
      },
      FWI: {
        descripcion: "Índice meteorológico de peligro de incendio (Fire Weather Index).",
        url_base: "https://yaku.ohmc.ar/public/FWI/",
        archivos: ["FWI.png"],
        tipo: "imagen estática",
        frecuencia_actualizacion: "diaria",
        ultima_actualizacion: "2025-04-23T10:54:00Z",
        ejemplo: "https://yaku.ohmc.ar/public/FWI/FWI.png"
      },
      rutas_caminera: {
        descripcion: "Animación de ráfagas de viento sobre rutas provinciales para apoyo vial.",
        url_base: "https://yaku.ohmc.ar/public/rutas_caminera/",
        archivos: ["rafagas_rutas.gif"],
        tipo: "animación GIF",
        frecuencia_actualizacion: "diaria",
        ultima_actualizacion: "2025-04-23T10:51:00Z",
        ejemplo: "https://yaku.ohmc.ar/public/rutas_caminera/rafagas_rutas.gif"
      },
      MedicionAire: {
        descripcion: "Visualizaciones diarias de gases de efecto invernadero (CO₂ y CH₄) medidos por el analizador Picarro en el OHMC.",
        url_base: "https://yaku.ohmc.ar/public/MedicionAire/",
        estructura_directorios: "MM/DD/",
        archivos: ["CH4_webvisualizer_v4.png", "CO2_webvisualizer_v4.png"],
        tipo: "imágenes estáticas que se actualizan diariamente",
        frecuencia_actualizacion: "diaria",
        ultima_actualizacion: "2025-06-26T00:00:00Z",
        ejemplos: [
          "https://yaku.ohmc.ar/public/MedicionAire/06/26/CH4_webvisualizer_v4.png",
          "https://yaku.ohmc.ar/public/MedicionAire/06/26/CO2_webvisualizer_v4.png"
        ]
      }
    }
  };

  // Función para generar URLs dinámicas basadas en la fecha
  const generateImageUrl = (project: string, variable?: string, date?: Date): string => {
    const projectConfig = routesConfig.proyectos[project];
    if (!projectConfig) return '';

    const now = date || new Date();
    
    switch (project) {
      case 'wrf_cba':
        if (!variable) variable = 't2';
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = '06'; // Corrida de las 06 UTC
        const forecast = '+09'; // 9 horas de pronóstico
        
        return `${projectConfig.url_base}${year}_${month}/${day}_${hour}/${variable}/${variable}-${year}-${month}-${day}_${hour}${forecast}.png`;
      
      case 'MedicionAire':
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const filename = variable || 'CO2_webvisualizer_v4.png';
        return `${projectConfig.url_base}${mm}/${dd}/${filename}`;
      
      case 'FWI':
      case 'rutas_caminera':
        const filename2 = projectConfig.archivos?.[0] || '';
        return `${projectConfig.url_base}${filename2}`;
      
      default:
        return projectConfig.ejemplo || '';
    }
  };

  // Función para verificar si necesita actualización
  const needsUpdate = (project: string): boolean => {
    const config = updateConfig.actualizaciones[project];
    if (!config) return false;

    const lastUpdate = new Date(config.ultima_actualizacion);
    const now = new Date();
    
    // Lógica simple: actualizar si han pasado más de 2 horas
    const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 2;
  };

  // Función para obtener datos actualizados
  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular fetch de datos del observatorio
      // En una implementación real, aquí harías llamadas a tu backend
      console.log('Fetching weather data from OHMC...');
      
      // Generar URLs actuales
      const currentData = {
        temperatura: generateImageUrl('wrf_cba', 't2'),
        precipitacion: generateImageUrl('wrf_cba', 'ppn'),
        viento: generateImageUrl('rutas_caminera'),
        incendios: generateImageUrl('FWI'),
        aire_co2: generateImageUrl('MedicionAire', 'CO2_webvisualizer_v4.png'),
        aire_ch4: generateImageUrl('MedicionAire', 'CH4_webvisualizer_v4.png')
      };
      
      console.log('Generated URLs:', currentData);
      setLastUpdate(new Date());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Configurar actualización automática
  useEffect(() => {
    // Cargar datos iniciales
    fetchWeatherData();
    
    // Configurar intervalo de actualización (cada 30 minutos)
    const interval = setInterval(() => {
      console.log('Checking for updates...');
      
      // Verificar si algún proyecto necesita actualización
      const projectsToUpdate = Object.keys(updateConfig.actualizaciones).filter(needsUpdate);
      
      if (projectsToUpdate.length > 0) {
        console.log('Updating projects:', projectsToUpdate);
        fetchWeatherData();
      }
    }, 30 * 60 * 1000); // 30 minutos
    
    return () => clearInterval(interval);
  }, []);

  return {
    isLoading,
    error,
    lastUpdate,
    routesConfig,
    updateConfig,
    generateImageUrl,
    fetchWeatherData,
    needsUpdate
  };
};
