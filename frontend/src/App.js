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
        pagination={{ clickable: true, el: '#custom-swiper-pagination', renderBullet: (index, className) => `<span class='${className} w-3 h-3 rounded-full mx-1 bg-white/40 inline-block'></span>` }}
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
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="rounded-2xl shadow-2xl p-6 w-full flex items-center gap-5 min-h-[120px] bg-[#223366]/80 backdrop-blur-lg"
                style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)' }}
              >
                <div className={`flex-shrink-0 bg-gradient-to-br ${widget.iconBg} p-4 rounded-full shadow-lg flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-2xl font-extrabold text-white mb-1 leading-tight">{widget.title}</span>
                  <span className="text-blue-100 text-base font-medium leading-snug">{widget.description}</span>
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
    <div className="min-h-screen flex flex-col bg-[#0a174e]">
      <Header />
      <main className="container mx-auto px-4 py-6 pt-32 flex-1">
        {/* Hero */}
        <section className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow"
          >
            Bienvenido a <span className="text-blue-200">Sky Cast</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl mx-auto"
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
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Nuestros Servicios</h2>
          <WidgetCarousel />
        </section>

        {/* Por qué elegirnos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">¿Por qué elegirnos?</h2>
          <ul className="list-disc list-inside text-blue-100 max-w-xl mx-auto text-lg space-y-2">
            <li>Datos en tiempo real y alta resolución</li>
            <li>Visualizaciones interactivas y modernas</li>
            <li>Acceso gratuito y abierto</li>
            <li>Soporte científico y técnico</li>
            <li>Colaboración con universidades y organismos</li>
          </ul>
        </section>

        {/* Testimonios */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Testimonios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "María G.",
                text: "La plataforma Sky Cast me permite planificar mis actividades rurales con información confiable y actualizada.",
                role: "Productora Agropecuaria"
              },
              {
                name: "Ing. Pablo R.",
                text: "El monitoreo de vientos y FWI es clave para la seguridad vial y la prevención de incendios.",
                role: "Ingeniero Caminero"
              },
              {
                name: "Dra. Lucía S.",
                text: "La visualización de gases atmosféricos es una herramienta fundamental para la investigación ambiental.",
                role: "Investigadora U.N.C."
              }
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.7, ease: 'easeOut' }}
                className="rounded-2xl shadow-lg p-6 bg-[#223366] text-white flex flex-col items-center"
                style={{ backdropFilter: 'blur(4px)' }}
              >
                <div className="text-3xl mb-2">“</div>
                <div className="text-blue-100 text-center mb-2">{t.text}</div>
                <div className="font-bold text-blue-200">{t.name}</div>
                <div className="text-blue-300 text-sm">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Contacto</h2>
          <p className="text-blue-100 mb-2">info@ohmc.com</p>
          <a href="mailto:info@ohmc.com" className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition">Enviar Email</a>
        </section>
      </main>
      <div className="w-full h-24 bg-gradient-to-b from-[#0a174e] to-[#1e293b]" />
      <footer className="bg-[#1e293b] text-white py-12 w-full mt-auto">
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
              <a href="/" className="block text-gray-400 hover:text-white transition-colors">Inicio</a>
              <a href="/landing" className="block text-gray-400 hover:text-white transition-colors">Landing</a>
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
      <Route path="/datos-meteorologicos" element={<DatosMeteorologicos />} />
    </Routes>
  );
}

export default App;
