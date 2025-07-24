import { Cloud } from "lucide-react"
import { MoreVertical } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#0a174e] border-b border-[#0a174e] shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => navigate("/landing")}
              title="Ir a la landing"
            >
              <Cloud className="h-8 w-8 text-white" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">OHMC</h1>
                <span className="text-base text-blue-200 font-semibold">Sky Cast</span>
              </div>
              <p className="text-blue-100 text-sm">Observatorio Hidrometeorológico</p>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              className="p-2 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              <MoreVertical className="h-7 w-7 text-white" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50">
                <button className="block w-full text-left px-5 py-3 text-blue-900 hover:bg-blue-50 font-medium transition">Datos Meteorológicos</button>
                <button className="block w-full text-left px-5 py-3 text-blue-900 hover:bg-blue-50 font-medium transition">Productos Meteorológicos</button>
                <button className="block w-full text-left px-5 py-3 text-blue-900 hover:bg-blue-50 font-medium transition">Quienes Somos</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
