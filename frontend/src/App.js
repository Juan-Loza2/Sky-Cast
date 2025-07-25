import { Routes, Route, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import WeatherCard from "./components/WeatherCard"
import { Cloud } from "lucide-react"
import "./index.css"
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from "framer-motion";
import QuienesSomos from "./pages/QuienesSomos"

function WidgetCarousel() {
  const widgets = [
    {
      title: "Modelo WRF",
      subtitle: "Datos meteorológicos de alta resolución",
      description: "Pronósticos precisos para Córdoba"
    },
    {
      title: "Índice FWI",
      subtitle: "Monitoreo de peligro de incendios",
      description: "Actualización en tiempo real"
    },
    {
      title: "Vientos en Rutas",
      subtitle: "Alertas de ráfagas para seguridad vial",
      description: "Información diaria para rutas"
    },
    {
      title: "Gases Atmosféricos",
      subtitle: "Medición de calidad del aire",
      description: "Contaminantes y variables ambientales"
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
        pagination={{ clickable: true, el: '#custom-swiper-pagination', renderBullet: (index, className) => `<span class='${className} w-3 h-3 rounded-full mx-1 bg-white/40 inline-block'></span>` }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={24}
        className="w-full"
      >
        {widgets.map((widget, i) => (
          <SwiperSlide key={i}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="rounded-2xl shadow-2xl p-6 w-full flex flex-col gap-2 text-white min-h-[180px] flex-1 justify-center items-center"
              style={{background: '#243b6b', backdropFilter: 'blur(6px)', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)'}}
            >
              <div className="mb-2">
                <span className="text-xl font-bold">{widget.title}</span>
              </div>
              <div className="text-lg font-semibold">{widget.subtitle}</div>
              <div className="text-sm opacity-80">{widget.description}</div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div id="custom-swiper-pagination" className="flex justify-center mt-6 mb-2 w-full" />
    </div>
  );
}

// Componente Landing separado
const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-[#0a174e]">
      <Header />
      <main className="container mx-auto px-4 py-6 pt-32">
        <div className="mb-8">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Observatorio Hidrometeorologico
              <span className="block text-blue-200 font-bold">de la Provincia de Cordoba</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl mx-auto"
            >
              Monitoreo meteorológico avanzado para la prevención de riesgos ambientales y la toma de decisiones informadas
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="flex justify-center mb-8"
            >
              <motion.button
                className="px-6 py-2 rounded-lg font-semibold text-lg transition-colors duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/")}
                initial={{ scale: 0.8, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
                animate={{ scale: 1, boxShadow: '0 8px 32px 0 rgba(30,64,175,0.25)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
                whileHover={{ scale: 1.05, boxShadow: '0 12px 32px 0 rgba(30,64,175,0.35)' }}
                whileTap={{ scale: 0.97 }}
              >
                Acceder al Dashboard
              </motion.button>
            </motion.div>
          </div>
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
            >
              <WeatherCard />
            </motion.div>
          </div>
        </div>
        {/* Carrusel de widgets */}
        <div className="mb-8">
          <WidgetCarousel />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-200 mb-2">24/7</div>
            <div className="text-blue-100 font-medium">Monitoreo Continuo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-200 mb-2">4</div>
            <div className="text-blue-100 font-medium">Tipos de Datos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-200 mb-2">100+</div>
            <div className="text-blue-100 font-medium">Variables Medidas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-200 mb-2">API</div>
            <div className="text-blue-100 font-medium">Acceso REST</div>
          </div>
        </motion.div>
      </main>
      {/* Degradé de azul a gris antes del footer */}
      <div className="w-full h-24 bg-gradient-to-b from-[#0a174e] to-[#1e293b]" />
      <footer className="bg-[#1e293b] text-white py-12 w-full">
        <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
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
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Inicio</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Servicios</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contacto</a>
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
        <div className="border-t border-gray-700 mt-8 pt-8 text-center px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400">
            © {new Date().getFullYear()} OHMC - Sky cast. Todos los derechos reservados. Desarrollado con fines educativos.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Componente Dashboard con Header
const DashboardWithHeader = () => {
  return (
    <div className="min-h-screen bg-[#0a174e]">
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
    </Routes>
  );
}

export default App;
