import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const weatherCodeMap = {
  0: { label: "Despejado", icon: "☀️" },
  1: { label: "Principalmente despejado", icon: "🌤️" },
  2: { label: "Parcialmente nublado", icon: "⛅" },
  3: { label: "Nublado", icon: "☁️" },
  45: { label: "Niebla", icon: "🌫️" },
  48: { label: "Niebla con escarcha", icon: "🌫️" },
  51: { label: "Llovizna ligera", icon: "🌦️" },
  53: { label: "Llovizna moderada", icon: "🌦️" },
  55: { label: "Llovizna densa", icon: "🌧️" },
  61: { label: "Lluvia ligera", icon: "🌦️" },
  63: { label: "Lluvia moderada", icon: "🌧️" },
  65: { label: "Lluvia intensa", icon: "🌧️" },
  71: { label: "Nieve ligera", icon: "❄️" },
  73: { label: "Nieve moderada", icon: "❄️" },
  75: { label: "Nieve intensa", icon: "❄️" },
  80: { label: "Chubascos ligeros", icon: "🌦️" },
  81: { label: "Chubascos moderados", icon: "🌧️" },
  82: { label: "Chubascos violentos", icon: "⛈️" },
};

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "dark");
    };
    
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem("theme") || "dark";
      setTheme(currentTheme);
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('DOMContentLoaded', handleThemeChange);
    
    // Verificar el tema inicial
    handleThemeChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('DOMContentLoaded', handleThemeChange);
    };
  }, []);

  // Efecto adicional para verificar el tema en cada render
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem("theme") || "dark";
    setTheme(currentTheme);
  });

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=-31.4167&longitude=-64.1833&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America%2FArgentina%2FCordoba`
      );
      const data = await res.json();
      const todayIdx = 0;
      const code = data.current_weather.weathercode;
      const condition = weatherCodeMap[code]?.label || "Variable";
      const icon = weatherCodeMap[code]?.icon || "☀️";
      setWeather({
        temp: Math.round(data.current_weather.temperature),
        feels_like: Math.round(data.current_weather.temperature), // Open-Meteo no da sensación térmica real
        min: Math.round(data.daily.temperature_2m_min[todayIdx]),
        max: Math.round(data.daily.temperature_2m_max[todayIdx]),
        condition,
        icon,
        time: new Date(data.current_weather.time),
      });
    } catch (e) {
      setError("No se pudo obtener el clima");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Actualiza cada minuto
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div 
        className="rounded-2xl shadow-lg p-6 w-full animate-pulse"
        style={{
          background: theme === "dark" ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
          color: theme === "dark" ? 'white' : '#1e293b'
        }}
      >
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }
  if (error || !weather) {
    return (
      <div 
        className="rounded-2xl shadow-lg p-6 w-full text-center"
        style={{
          background: theme === "dark" ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
          color: theme === "dark" ? 'white' : '#1e293b'
        }}
      >
        <span className="text-red-600">{error || "No hay datos de clima"}</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="rounded-2xl shadow-xl p-6 w-full flex flex-col gap-2 relative overflow-hidden group"
      style={{
        background: theme === "dark" ? '#243b6b' : '#ffffff',
        backdropFilter: 'blur(6px)',
        color: theme === "dark" ? 'white' : '#1e293b'
      }}
    >
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Elementos de fondo animados según el clima */}
      <div className="absolute inset-0 pointer-events-none">
        {weather.condition.includes('Despejado') && (
          <>
            {/* Rayos de sol */}
            <motion.div
              className="absolute w-0.5 h-8 bg-yellow-300 rounded-full"
              animate={{ 
                rotate: [0, 360],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ top: '15%', left: '20%', transformOrigin: 'center bottom' }}
            />
            <motion.div
              className="absolute w-0.5 h-6 bg-orange-300 rounded-full"
              animate={{ 
                rotate: [0, -360],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
              style={{ top: '25%', left: '80%', transformOrigin: 'center bottom' }}
            />
          </>
        )}
        
        {weather.condition.includes('Nublado') && (
          <>
            {/* Nubes flotantes */}
            <motion.div
              className="absolute w-8 h-4 bg-white/20 rounded-full"
              animate={{ 
                x: [-20, 100],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ top: '20%' }}
            />
            <motion.div
              className="absolute w-6 h-3 bg-white/15 rounded-full"
              animate={{ 
                x: [-20, 100],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
              style={{ top: '40%' }}
            />
          </>
        )}
        
        {weather.condition.includes('Lluvia') && (
          <>
            {/* Gotas de lluvia */}
            <motion.div
              className="absolute w-0.5 h-3 bg-blue-300 rounded-full"
              animate={{ 
                y: [-10, 100],
                opacity: [0.6, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ left: '25%' }}
            />
            <motion.div
              className="absolute w-0.5 h-2 bg-blue-400 rounded-full"
              animate={{ 
                y: [-10, 100],
                opacity: [0.7, 0]
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: 0.3 }}
              style={{ left: '60%' }}
            />
            <motion.div
              className="absolute w-0.5 h-4 bg-blue-200 rounded-full"
              animate={{ 
                y: [-10, 100],
                opacity: [0.5, 0]
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.7 }}
              style={{ left: '85%' }}
            />
          </>
        )}
        
        {weather.condition.includes('Nieve') && (
          <>
            {/* Copos de nieve */}
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{ 
                y: [-10, 100],
                x: [0, 10, -10, 0],
                opacity: [0.8, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ left: '30%' }}
            />
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{ 
                y: [-10, 100],
                x: [0, -15, 15, 0],
                opacity: [0.6, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
              style={{ left: '70%' }}
            />
          </>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        <motion.span 
          className="text-6xl font-extrabold leading-none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {weather.temp}°
        </motion.span>
        <motion.span 
          className="text-sm opacity-80 mt-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.8, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {weather.time.toLocaleString('es-AR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
        </motion.span>
      </div>
      
      <div className="text-2xl font-bold flex items-center gap-2 mb-1 relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {weather.condition}
        </motion.span>
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
          className="text-2xl"
        >
          {weather.icon}
        </motion.span>
      </div>
      
      <motion.div 
        className="text-sm opacity-90 mb-1 relative z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <span className="align-middle">↑ {weather.max}° / ↓ {weather.min}°</span>
      </motion.div>
      
      <motion.div 
        className="text-sm opacity-80 relative z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        Sensación Térmica {weather.feels_like}°
      </motion.div>
    </motion.div>
  );
} 