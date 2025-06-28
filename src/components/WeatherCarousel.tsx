
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeatherImage {
  id: string;
  url: string;
  date: Date;
  title: string;
}

interface WeatherCarouselProps {
  title: string;
  icon: string;
  images: WeatherImage[];
  type: string;
  description: string;
}

const WeatherCarousel: React.FC<WeatherCarouselProps> = ({
  title,
  icon,
  images,
  type,
  description
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gifFrameIndex, setGifFrameIndex] = useState(0);

  const getCardColor = (type: string) => {
    const colors = {
      precipitaciones: 'from-blue-600 to-blue-800',
      incendios: 'from-red-600 to-red-800',
      vientos: 'from-green-600 to-green-800',
      temperatura: 'from-orange-600 to-orange-800',
      aire: 'from-purple-600 to-purple-800'
    };
    return colors[type as keyof typeof colors] || 'from-gray-600 to-gray-800';
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setGifFrameIndex(0); // Reset GIF frame when changing image
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setGifFrameIndex(0); // Reset GIF frame when changing image
  };

  const isGif = (url: string) => {
    return url.toLowerCase().includes('.gif');
  };

  const nextGifFrame = () => {
    // For GIFs, we simulate frame navigation by adding a timestamp parameter
    // This forces the browser to reload the image, effectively restarting the animation
    setGifFrameIndex(prev => prev + 1);
  };

  const prevGifFrame = () => {
    setGifFrameIndex(prev => Math.max(0, prev - 1));
  };

  if (images.length === 0) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${getCardColor(type)} p-4 text-white`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold text-lg">{title}</h3>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-white/80">No hay imágenes disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentImage = images[currentIndex];
  const currentIsGif = isGif(currentImage.url);

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-r ${getCardColor(type)} p-4 text-white`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{icon}</span>
              <h3 className="font-semibold text-lg">{title}</h3>
            </div>
            <span className="text-sm opacity-90">
              {format(currentImage.date, "dd/MM HH:mm", { locale: es })}
            </span>
          </div>
          
          <div className="relative">
            {/* Imagen principal con controles de carrusel */}
            <div className="relative group">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer hover:opacity-80 transition-opacity">
                    <img
                      src={currentIsGif ? `${currentImage.url}?t=${gifFrameIndex}` : currentImage.url}
                      alt={`${title} - ${format(currentImage.date, "dd/MM/yyyy HH:mm", { locale: es })}`}
                      className="w-full h-48 object-cover rounded-lg bg-white/20"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">
                        {currentIsGif ? 'Click para controlar animación' : 'Click para expandir'}
                      </span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] p-2">
                  <div className="relative">
                    <img
                      src={currentIsGif ? `${currentImage.url}?t=${gifFrameIndex}` : currentImage.url}
                      alt={`${title} - expandida`}
                      className="w-full h-auto object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {title} - {format(currentImage.date, "dd/MM/yyyy HH:mm", { locale: es })}
                      {currentIsGif && (
                        <span className="ml-2 text-xs bg-white/20 px-1 rounded">GIF</span>
                      )}
                    </div>
                    
                    {/* GIF Controls in expanded view */}
                    {currentIsGif && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white h-12 w-12"
                          onClick={prevGifFrame}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white h-12 w-12"
                          onClick={nextGifFrame}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded text-sm">
                          Frame: {gifFrameIndex + 1}
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Controles del carrusel (solo si hay múltiples imágenes) */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Indicadores de carrusel */}
            {images.length > 1 && (
              <div className="flex justify-center space-x-2 mt-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setGifFrameIndex(0);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Información de la fecha actual */}
          <div className="mt-3 text-center">
            <p className="text-xs text-white/90">
              {format(currentImage.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            <p className="text-xs text-white/70 mt-1">{description}</p>
            {currentIsGif && (
              <p className="text-xs text-white/60 mt-1">
                🎬 Animación GIF - Click para controlar
              </p>
            )}
            {images.length > 1 && (
              <p className="text-xs text-white/60 mt-1">
                {currentIndex + 1} de {images.length} imágenes
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCarousel;
