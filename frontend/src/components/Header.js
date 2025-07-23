import { Cloud, Activity } from "lucide-react"

const Header = () => {
  return (
    <header className="bg-[#0a174e] border-b border-[#0a174e] shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Cloud className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">OHMC</h1>
              <p className="text-blue-100 text-sm">Observatorio Hidrometeorológico</p>
            </div>
          </div>
          {/* Sección 'En vivo' eliminada */}
        </div>
      </div>
    </header>
  )
}

export default Header
