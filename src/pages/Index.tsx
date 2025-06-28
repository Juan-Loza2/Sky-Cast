
import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWeatherData } from '@/hooks/useWeatherData';
import DateFilter from '@/components/DateFilter';
import UpdateStatus from '@/components/UpdateStatus';
import WeatherCarousel from '@/components/WeatherCarousel';
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeatherImage {
  id: string;
  url: string;
  date: Date;
  title: string;
}

interface WeatherProduct {
  id: string;
  title: string;
  type: 'precipitaciones' | 'incendios' | 'vientos' | 'temperatura' | 'aire';
  icon: string;
  images: WeatherImage[];
  description: string;
}

const Index = () => {
  const { 
    isLoading, 
    error, 
    lastUpdate, 
    generateImageUrl, 
    fetchWeatherData 
  } = useWeatherData();
  
  const [filteredProducts, setFilteredProducts] = useState<WeatherProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today');

  // Generar imágenes para un período específico
  const generateImagesForPeriod = (project: string, variable: string, period: string): WeatherImage[] => {
    const images: WeatherImage[] = [];
    const now = new Date();
    
    let days = 1;
    switch (period) {
      case 'yesterday':
        days = 1;
        break;
      case '3days':
        days = 3;
        break;
      case '1week':
        days = 7;
        break;
      case 'today':
      default:
        days = 1;
        break;
    }

    // Si hay una fecha específica seleccionada, usar solo esa fecha
    if (selectedDate) {
      const url = generateImageUrl(project, variable, selectedDate);
      images.push({
        id: `${project}-${variable}-${format(selectedDate, 'yyyy-MM-dd')}`,
        url,
        date: selectedDate,
        title: `${project} ${variable}`
      });
      return images;
    }

    // Generar imágenes para el período seleccionado
    for (let i = period === 'today' ? 0 : 1; i <= days; i++) {
      const date = subDays(now, period === 'today' ? 0 : i);
      const url = generateImageUrl(project, variable, date);
      
      images.push({
        id: `${project}-${variable}-${format(date, 'yyyy-MM-dd')}`,
        url,
        date,
        title: `${project} ${variable}`
      });
    }

    return images.reverse(); // Mostrar desde la más antigua a la más reciente
  };

  // Generar productos usando los datos reales del observatorio
  const generateProducts = (): WeatherProduct[] => {
    return [
      {
        id: '1',
        title: 'Precipitaciones',
        type: 'precipitaciones',
        icon: '☔',
        images: [
          ...generateImagesForPeriod('wrf_cba', 'ppn', selectedPeriod),
          ...generateImagesForPeriod('wrf_cba', 'ppnaccum', selectedPeriod)
        ],
        description: 'Precipitación horaria y acumulada del modelo WRF'
      },
      {
        id: '2',
        title: 'Incendios',
        type: 'incendios',
        icon: '🔥',
        images: generateImagesForPeriod('FWI', '', selectedPeriod),
        description: 'Índice de riesgo de incendio (FWI)'
      },
      {
        id: '3',
        title: 'Vientos',
        type: 'vientos',
        icon: '💨',
        images: [
          ...generateImagesForPeriod('rutas_caminera', '', selectedPeriod),
          ...generateImagesForPeriod('wrf_cba', 'wspd10', selectedPeriod)
        ],
        description: 'Ráfagas de viento en rutas provinciales'
      },
      {
        id: '4',
        title: 'Temperatura',
        type: 'temperatura',
        icon: '🌡️',
        images: [
          ...generateImagesForPeriod('wrf_cba', 't2', selectedPeriod),
          ...generateImagesForPeriod('wrf_cba', 'rh2', selectedPeriod)
        ],
        description: 'Temperatura y humedad relativa'
      },
      {
        id: '5',
        title: 'Calidad del Aire',
        type: 'aire',
        icon: '🌫️',
        images: [
          ...generateImagesForPeriod('MedicionAire', 'CO2_webvisualizer_v4.png', selectedPeriod),
          ...generateImagesForPeriod('MedicionAire', 'CH4_webvisualizer_v4.png', selectedPeriod)
        ],
        description: 'Medición de gases CO₂ y CH₄'
      }
    ];
  };

  // Actualizar productos cuando cambien los filtros
  useEffect(() => {
    const products = generateProducts();
    let filtered = products;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => product.type === selectedType);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedType, selectedDate, selectedPeriod, generateImageUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header con nubes de fondo */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent"></div>
        <div className="relative z-10 max-w-md mx-auto p-4">
          
          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Imágenes
            </h1>
            
            {/* Estado del sistema */}
            <UpdateStatus 
              lastUpdate={lastUpdate}
              isLoading={isLoading}
              error={error}
              className="mb-4 bg-white/10 text-white border-white/20"
            />
          </div>

          {/* Controles */}
          <div className="space-y-3 mb-6">
            {/* Barra de búsqueda con ícono de calendario */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-12 bg-white/90 border-0 rounded-xl"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
            </div>

            {/* Filtro por tipo */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white/90 border-0 rounded-xl">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                <SelectItem value="precipitaciones">☔ Precipitaciones</SelectItem>
                <SelectItem value="incendios">🔥 Incendios</SelectItem>
                <SelectItem value="vientos">💨 Vientos</SelectItem>
                <SelectItem value="temperatura">🌡️ Temperatura</SelectItem>
                <SelectItem value="aire">🌫️ Calidad del Aire</SelectItem>
              </SelectContent>
            </Select>

            {/* Selector de período */}
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="bg-white/90 border-0 rounded-xl">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="yesterday">Ayer</SelectItem>
                <SelectItem value="3days">Últimos 3 días</SelectItem>
                <SelectItem value="1week">Última semana</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro por fecha específica */}
            <DateFilter
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {/* Productos meteorológicos */}
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <WeatherCarousel
                key={product.id}
                title={product.title}
                icon={product.icon}
                images={product.images}
                type={product.type}
                description={product.description}
              />
            ))}
          </div>

          {/* Estado vacío */}
          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-white text-lg">No se encontraron productos</p>
              <p className="text-white/80 text-sm">
                {searchTerm || selectedType !== 'all' || selectedDate 
                  ? 'Intenta con otros filtros' 
                  : 'Cargando datos del observatorio...'}
              </p>
            </div>
          )}

          {/* Indicador de carga */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white text-sm">Actualizando datos meteorológicos...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
