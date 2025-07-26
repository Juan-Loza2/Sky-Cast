import { Cloud } from "lucide-react"
import { MoreVertical } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="border-b shadow-sm fixed top-0 left-0 w-full z-50" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
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
                <h1 className="text-2xl font-bold text-[var(--color-text)]">OHMC</h1>
                <span className="text-base font-semibold" style={{ color: 'var(--color-primary)' }}>Sky Cast</span>
              </div>
              <p className="text-sm text-[var(--color-text)]">Observatorio Hidrometeorológico</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Cambiar tema"
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            >
              {theme === "dark" ? <Moon className="h-6 w-6 text-blue-700" /> : <Sun className="h-6 w-6 text-yellow-300" />}
            </button>
            {/* Menú hamburguesa */}
            <div className="relative" ref={menuRef}>
              <button
                className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  theme === "dark" 
                    ? "hover:bg-blue-800" 
                    : "hover:bg-white/20"
                }`}
                onClick={() => setOpen((v) => !v)}
                aria-label="Abrir menú"
              >
                <MoreVertical className={`h-7 w-7 ${theme === "dark" ? "text-white" : "text-blue-600"}`} />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 z-50"
                    style={{ 
                      background: theme === "dark" ? 'var(--color-card)' : 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(6px)', 
                      opacity: 0.95 
                    }}
                  >
                    <motion.button
                      initial={{ opacity: 0, rotateX: -15 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                      className={`block w-full text-left px-5 py-3 font-medium transition ${
                        theme === "dark" 
                          ? "text-blue-100 hover:bg-blue-900/60" 
                          : "text-black hover:bg-blue-100"
                      }`}
                      onClick={() => { navigate('/datos-meteorologicos'); setOpen(false); }}
                    >
                      Datos Meteorológicos
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, rotateX: -15 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                      className={`block w-full text-left px-5 py-3 font-medium transition ${
                        theme === "dark" 
                          ? "text-blue-100 hover:bg-blue-900/60" 
                          : "text-black hover:bg-blue-100"
                      }`}
                      onClick={() => { navigate('/'); setOpen(false); }}
                    >
                      Productos Meteorológicos
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, rotateX: -15 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
                      className={`block w-full text-left px-5 py-3 font-medium transition ${
                        theme === "dark" 
                          ? "text-blue-100 hover:bg-blue-900/60" 
                          : "text-black hover:bg-blue-100"
                      }`}
                      onClick={() => { navigate('/quienes-somos'); setOpen(false); }}
                    >
                      Quienes Somos
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
