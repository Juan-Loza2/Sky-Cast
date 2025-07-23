import { Cloud, Activity, MoreVertical } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const Header = () => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="bg-[#0a174e]/80 border-b border-[#0a174e] shadow-sm fixed top-0 left-0 w-full z-50 backdrop-blur">
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
          {/* Menú de tres puntitos */}
          <div className="relative" ref={menuRef}>
            <button
              className="p-2 rounded-full hover:bg-blue-900/40 transition focus:outline-none"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <MoreVertical className="h-7 w-7 text-white" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-[#22335a] rounded-xl shadow-lg py-2 z-50">
                <a
                  href="#"
                  className="block px-5 py-3 text-blue-100 hover:bg-blue-900/40 hover:text-white font-medium transition"
                >
                  Datos Meteorológicos
                </a>
                <a
                  href="#"
                  className="block px-5 py-3 text-blue-100 hover:bg-blue-900/40 hover:text-white font-medium transition"
                >
                  Productos Meteorológicos
                </a>
                <a
                  href="#"
                  className="block px-5 py-3 text-blue-100 hover:bg-blue-900/40 hover:text-white font-medium transition"
                >
                  Quienes Somos
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
