'use client';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Menu, Home, Radar as RadarIcon, Camera, Umbrella, Flame, Wind, CloudRain } from 'lucide-react'
import Link from "next/link"

export default function WeatherApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white bg-cover bg-center bg-no-repeat animated-bg" style={{ backgroundImage: 'url("/fondo-clima.png")' }}>
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-slate-700/80 backdrop-blur-sm flex items-center justify-between p-4 md:p-6">
        <h1 className="text-white text-lg md:text-xl lg:text-2xl font-semibold">Weather</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Container */}
      <div className="w-full min-h-screen px-2 pt-20 pb-20">
        {/* Main Weather Card */}
        <div className="p-4 md:p-6">
          <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-3xl p-6 text-white">
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-6xl md:text-7xl font-light mb-2">24°</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">Soleado</span>
                    <Sun className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 icon-rotate" />
                  </div>
                  <div className="text-sm md:text-base text-gray-300">
                    <div>↑ 20°/7° ↓</div>
                    <div>Sensación Térmica 20°</div>
                  </div>
                </div>
                <div className="text-sm md:text-base text-gray-300">mar, 14:50</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Details Grid */}
        <div className="px-4 pb-4 md:px-6 md:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* UV Index */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Umbrella className="h-4 w-4 md:h-6 md:w-6" />
                  <span className="text-sm md:text-base text-gray-300">Índice UV</span>
                </div>
                <div className="text-sm md:text-base text-gray-300 mb-3">Moderado en este momento</div>
                <div className="text-2xl md:text-3xl font-semibold mb-2">Moderado</div>
                <div className="w-full bg-gray-600 rounded-full h-2 md:h-3">
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 h-2 md:h-3 rounded-full w-1/2"></div>
                </div>
              </CardContent>
            </Card>
            {/* Fire Risk */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4 md:h-6 md:w-6" />
                  <span className="text-sm md:text-base text-gray-300">Incendios</span>
                </div>
                <div className="text-sm md:text-base text-gray-300 mb-3">Probabilidad de incendio de 30%</div>
                <div className="text-2xl md:text-3xl font-semibold mb-2">30%</div>
                <div className="w-full bg-gray-600 rounded-full h-2 md:h-3">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 md:h-3 rounded-full w-1/3"></div>
                </div>
              </CardContent>
            </Card>
            {/* Wind */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wind className="h-4 w-4 md:h-6 md:w-6" />
                  <span className="text-sm md:text-base text-gray-300">Vientos</span>
                </div>
                <div className="text-sm md:text-base text-gray-300 mb-3">Ligera brisa</div>
                <div className="flex items-center justify-center">
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <svg className="w-16 h-16 md:w-20 md:h-20 transform -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" stroke="rgb(75 85 99)" strokeWidth="4" fill="none" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgb(147 197 253)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(10 / 50) * 175.93} 175.93`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg md:text-xl font-semibold">10</span>
                      <span className="text-xs md:text-sm text-gray-300">km/h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Precipitation */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CloudRain className="h-4 w-4 md:h-6 md:w-6" />
                  <span className="text-sm md:text-base text-gray-300">Precipitaciones</span>
                </div>
                <div className="text-2xl md:text-3xl font-semibold mb-1">3 mm</div>
                <div className="text-sm md:text-base text-gray-300">Hoy</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-700/80 backdrop-blur-sm">
          <div className="flex items-center justify-around py-4">
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
              <Home className="h-5 w-5 md:h-6 md:w-6 icon-animate" />
              <span className="text-xs md:text-sm">Home</span>
            </Button>
            <Link href="/Radar" className="flex flex-col items-center gap-1 text-white">
              <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
                <RadarIcon className="h-5 w-5 md:h-6 md:w-6 icon-animate" />
                <span className="text-xs md:text-sm">Radar</span>
              </Button>
            </Link>
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
              <Camera className="h-5 w-5 md:h-6 md:w-6 icon-animate" />
              <span className="text-xs md:text-sm">Fotos</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}