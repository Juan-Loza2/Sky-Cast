import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Menu, Home, Radar, Camera, UmbrellaIcon as UVIcon, Flame, Wind, CloudRain } from 'lucide-react'

export default function WeatherApp() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="px-4 py-2">
        <p className="text-gray-400 text-sm">Android-Mobile</p>
      </div>

      {/* Main Container */}
      <div className="max-w-sm mx-auto bg-cover bg-center bg-no-repeat rounded-t-3xl min-h-screen" style={{ backgroundImage: 'url("/fondo-clima.png")' }}>
        {/* Weather Header */}
        <div className="flex items-center justify-between p-4 bg-slate-700/80 backdrop-blur-sm">
          <h1 className="text-white text-lg font-semibold">Weather</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Weather Card */}
        <div className="p-4">
          <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-3xl p-6 text-white">
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-6xl font-light mb-2">24°</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">Soleado</span>
                    <Sun className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="text-sm text-gray-300">
                    <div>↑ 20°/7° ↓</div>
                    <div>Sensación Térmica 20°</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300">mar, 14:50</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Details Grid */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {/* UV Index */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UVIcon className="h-4 w-4" />
                  <span className="text-sm text-gray-300">Índice UV</span>
                </div>
                <div className="text-sm text-gray-300 mb-3">Moderado en este momento</div>
                <div className="text-2xl font-semibold mb-2">Moderado</div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 h-2 rounded-full w-1/2"></div>
                </div>
              </CardContent>
            </Card>

            {/* Fire Risk */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm text-gray-300">Incendios</span>
                </div>
                <div className="text-sm text-gray-300 mb-3">Probabilidad de incendio de 30%</div>
                <div className="text-2xl font-semibold mb-2">30%</div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full w-1/3"></div>
                </div>
              </CardContent>
            </Card>

            {/* Wind */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wind className="h-4 w-4" />
                  <span className="text-sm text-gray-300">Vientos</span>
                </div>
                <div className="text-sm text-gray-300 mb-3">Ligera brisa</div>
                <div className="flex items-center justify-center">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
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
                      <span className="text-lg font-semibold">10</span>
                      <span className="text-xs text-gray-300">km/h</span>
                    </div>
                  </div>
                </div>
                
              </CardContent>
            </Card>

            {/* Precipitation */}
            <Card className="bg-slate-700/90 backdrop-blur-sm border-0 rounded-2xl text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CloudRain className="h-4 w-4" />
                  <span className="text-sm text-gray-300">Precipitaciones</span>
                </div>
                <div className="text-2xl font-semibold mb-1">3 mm</div>
                <div className="text-sm text-gray-300">Hoy</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-auto bg-slate-700/80 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center justify-around py-4">
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
              <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
              <Radar className="h-5 w-5" />
              <span className="text-xs">Radar</span>
            </Button>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
              <Camera className="h-5 w-5" />
              <span className="text-xs">Fotos</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}