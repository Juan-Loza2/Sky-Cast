import { Routes, Route, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import WeatherCard from "./components/WeatherCard"
import { Cloud, Thermometer, Flame, Wind, Activity } from "lucide-react"
import "./index.css"
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from "framer-motion";
import QuienesSomos from "./pages/QuienesSomos"
import DatosMeteorologicos from "./pages/DatosMeteorologicos"

function WidgetCarousel() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem("theme") || "dark");
  
  React.useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const widgets = [
    {
      title: "Modelo WRF",
      description: "Pronóstico meteorológico para la provincia de Córdoba.",
      icon: Thermometer,
      iconBg: "from-blue-500 to-indigo-500"
    },
    {
      title: "Índice FWI",
      description: "Monitoreo de peligro de incendios forestales",
      icon: Flame,
      iconBg: "from-orange-500 to-red-500"
    },
    {
      title: "Vientos en Rutas",
      description: "Alertas de ráfagas para seguridad vial",
      icon: Wind,
      iconBg: "from-cyan-500 to-blue-400"
    },
    {
      title: "Gases Atmosféricos",
      description: "Medición de calidad del aire y contaminantes",
      icon: Activity,
      iconBg: "from-green-500 to-blue-500"
    }
  ];
  useEffect(() => {
    // Mover la paginación fuera del Swiper
    const swiperPagination = document.querySelector('.swiper-pagination');
    const customPagination = document.getElementById('custom-swiper-pagination');
    if (swiperPagination && customPagination) {
      customPagination.appendChild(swiperPagination);
    }
  });
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true, el: '#custom-swiper-pagination', renderBullet: (index, className) => `<span class='${className} w-3 h-3 rounded-full mx-1 bg-blue-600/60 dark:bg-white/40 inline-block'></span>` }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={24}
        className="w-full"
      >
        {widgets.map((widget, i) => {
          const Icon = widget.icon;
          return (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: theme === 'dark' 
                    ? '0 15px 50px 0 rgba(0,0,0,0.5), 0 6px 20px 0 rgba(0,0,0,0.3)' 
                    : '0 12px 35px 0 rgba(0,0,0,0.25), 0 6px 18px 0 rgba(0,0,0,0.15)'
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`rounded-2xl p-6 border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] rounded-xl w-full flex items-center gap-5 min-h-[120px] backdrop-blur-lg cursor-pointer ${
                  theme === 'dark' ? 'shadow-2xl' : 'shadow-xl'
                }`}
                style={{ 
                  boxShadow: theme === 'dark' 
                    ? '0 10px 40px 0 rgba(0,0,0,0.4), 0 4px 16px 0 rgba(0,0,0,0.2)' 
                    : '0 8px 25px 0 rgba(0,0,0,0.15), 0 4px 12px 0 rgba(0,0,0,0.1)' 
                }}
              >
                <div className={`flex-shrink-0 bg-gradient-to-br ${widget.iconBg} p-4 rounded-full shadow-lg flex items-center justify-center`} style={{
                  boxShadow: theme === 'dark' 
                    ? '0 4px 16px 0 rgba(0,0,0,0.3)' 
                    : '0 4px 16px 0 rgba(0,0,0,0.2)'
                }}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-2xl font-extrabold text-[var(--color-text)] mb-1 leading-tight">{widget.title}</span>
                  <span className="text-[var(--color-text)] text-base font-medium leading-snug">{widget.description}</span>
                </div>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div id="custom-swiper-pagination" className="flex justify-center mt-6 mb-2 w-full" />
    </div>
  );
}

// Componente Landing separado
function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="container mx-auto px-4 py-6 pt-32 flex-1">
        {/* Hero */}
        <section className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl md:text-5xl font-extrabold text-[var(--color-text)] mb-4 drop-shadow"
          >
            Bienvenido a <span className="text-base-200 font-semibold" style={{ color: 'var(--color-primary)' }}>Sky Cast</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-lg md:text-xl text-[var(--color-text)] mb-6 max-w-2xl mx-auto"
          >
            Monitoreo meteorológico avanzado, visualizaciones interactivas y datos ambientales en tiempo real para Córdoba y la región.
          </motion.p>
          <motion.button
            className="px-8 py-3 rounded-lg font-bold text-lg transition-colors duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/")}
            initial={{ scale: 0.8, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            animate={{ scale: 1, boxShadow: '0 8px 32px 0 rgba(30,64,175,0.25)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 32px 0 rgba(30,64,175,0.35)' }}
            whileTap={{ scale: 0.97 }}
          >
            Acceder al Dashboard
          </motion.button>
        </section>

        {/* Carrusel de widgets */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 text-center">Nuestros Servicios</h2>
          <WidgetCarousel />
        </section>

        {/* Por qué elegirnos - Rediseño Moderno con Tema */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-12 text-center drop-shadow-lg">
              ¿Por qué elegirnos?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🌐",
                  title: "Tecnología de Monitoreo Avanzada",
                  description: "Datos en tiempo real con precisión milimétrica",
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                },
                {
                  icon: "📊",
                  title: "Visualizaciones Inmersivas",
                  description: "Plataforma interactiva con análisis predictivo y gráficos 2D en tiempo real",
                  color: "from-purple-500 to-pink-500",
                  bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                },
                {
                  icon: "🔓",
                  title: "Acceso Universal",
                  description: "API abierta y gratuita para democratizar la información ambiental global",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                },
                {
                  icon: "🧠",
                  title: "Conocimiento Científico",
                  description: "Equipo especializado en meteorología computacional e productos meteorológicos",
                  color: "from-orange-500 to-red-500",
                  bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
                },

                {
                  icon: "⚡",
                  title: "Innovación Continua",
                  description: "Desarrollo constante de nuevas tecnologías y metodologías de vanguardia",
                  color: "from-yellow-500 to-orange-500",
                  bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    delay: idx * 0.1, 
                    duration: 0.6, 
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative"
                >
                  <div className={`bg-gradient-to-br ${feature.bgColor} backdrop-blur-lg rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-xl hover:shadow-2xl`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--color-text)]/80 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

                  {/* Contacto */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Contáctanos</h2>
          <p className="text-[var(--color-text)] mb-2">info@ohmc.com</p>
          <a href="mailto:info@ohmc.com" className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition">Enviar Email</a>
        </section>
      </main>
      <footer className="bg-[var(--color-bg)] text-[var(--color-text)] py-12 w-full mt-auto">
        <div className="grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">OHMC</h3>
                <p className="text-gray-400 text-sm">Sky cast</p>
              </div>
            </div>
            <p className="text-gray-400">
              Observatorio Hidrometeorologico de la Provincia de Cordoba - Monitoreo meteorológico avanzado para la prevención de riesgos ambientales.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <a href="/landing" className="block text-gray-400 hover:text-white transition-colors">Inicio</a>
                <a href="/datos-meteorologicos" className="block text-gray-400 hover:text-white transition-colors">Datos Meteorológicos</a>
                <a href="/quienes-somos" className="block text-gray-400 hover:text-white transition-colors">Quienes Somos</a>
                <a href="/" className="block text-gray-400 hover:text-white transition-colors">Dashboard</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Servicios</h4>
              <div className="space-y-2">
                <p className="text-gray-400">Modelo WRF</p>
                <p className="text-gray-400">Índice FWI</p>
                <p className="text-gray-400">Vientos en Rutas</p>
                <p className="text-gray-400">Gases Atmosféricos</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400">
            © {new Date().getFullYear()} OHMC - Sky cast. Todos los derechos reservados. Desarrollado con fines educativos.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente Dashboard con Header
const DashboardWithHeader = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="container mx-auto px-4 py-6 pt-32">
        <Dashboard />
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardWithHeader />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/quienes-somos" element={<QuienesSomos />} />
      <Route path="/datos-meteorologicos" element={<DatosMeteorologicos />} />
    </Routes>
  );
}

export default App;
