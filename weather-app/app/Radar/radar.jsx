import { Button } from "@/components/ui/button"
import { Sun, Menu, Home, Radar as RadarIcon, Camera } from 'lucide-react'
import Link from "next/link"

export default function Radar() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="px-4 py-2">
        <p className="text-gray-400 text-sm">Android-Mobile</p>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-sm mx-auto bg-cover bg-center bg-no-repeat rounded-t-3xl w-full" style={{ backgroundImage: 'url("/fondo-clima.png")' }}>
        {/* Weather Header */}
        <div className="flex items-center justify-between p-4 bg-slate-700/80 backdrop-blur-sm">
          <h1 className="text-white text-lg font-semibold">Weather</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Main Weather Card */}
        <div className="p-4">
        <div className="botones-de-prueba">
      <div className="overlap-wrapper">
        <div className="overlap">

          <div className="frame">
            <div className="overlap-group">
              <div className="rectangle" />



              <div className="text-wrapper">Precipitaciones</div>

              <div className="text-wrapper-2">mar, 14:50</div>

              <div className="component-wrapper">
                <Component
                  className="component-1"
                  depthFrameClassName="component-instance"
                  depthFrameClassNameOverride="component-1-instance"
                />
              </div>
            </div>

            <div className="overlap-2">
              <div className="rectangle" />

              <div className="text-wrapper">Incendios</div>

              <div className="text-wrapper-2">mar, 14:50</div>

              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <Component
                    className="design-component-instance-node"
                    depthFrameClassNameOverride="component-2"
                    hasDepthFrame={false}
                  />
                  <Component
                    className="design-component-instance-node"
                    depthFrameClassName="component-3"
                    depthFrameClassNameOverride="component-4"
                  />
                </div>
              </div>

 
            </div>

            <div className="overlap-3">
              <div className="rectangle" />

      

              <div className="text-wrapper">Precipitaciones</div>

              <div className="text-wrapper-2">mar, 14:50</div>

              <div className="component-wrapper">
                <Component
                  className="component-1"
                  depthFrameClassName="component-5"
                  depthFrameClassNameOverride="component-6"
                />
              </div>
            </div>
          </div>

          <div className="rectangle-2" />

  

          <div className="text-wrapper-3">Precipitaciones</div>

          <div className="text-wrapper-4">mar, 14:50</div>

          <div className="rectangle-3" />

          <div className="text-wrapper-5">Incendios</div>

          <div className="text-wrapper-6">mar, 14:50</div>

          <div className="component-1-wrapper">
            <Component
              className="component-1"
              depthFrameClassName="component-7"
              depthFrameClassNameOverride="component-8"
            />
          </div>

          <div className="div-wrapper">
            <div className="overlap-group-2">
              <Component
                className="design-component-instance-node"
                depthFrameClassNameOverride="component-9"
                hasDepthFrame={false}
              />
              <Component
                className="design-component-instance-node"
                depthFrameClassName="component-10"
                depthFrameClassNameOverride="component-11"
              />
            </div>
          </div>

     
        </div>
      </div>
    </div>
        </div>

        {/* Weather Details Grid */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3"></div>
        </div>
      </div>
    
      {/* Bottom Navigation */}
      <div className="bg-slate-700/80 backdrop-blur-sm rounded-t-3xl w-full max-w-sm mx-auto">
        <div className="flex items-center justify-around py-4">
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
            <Link href="/Radar">
              <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
                <RadarIcon className="h-5 w-5" />
                <span className="text-xs">Radar</span>
              </Button>
            </Link>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-white">
            <Camera className="h-5 w-5" />
            <span className="text-xs">Fotos</span>
          </Button>
        </div>
      </div>
    </div>
  )
}