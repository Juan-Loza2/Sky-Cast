import React, { useEffect, useState } from "react";

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
      <div className="rounded-2xl bg-white/30 shadow-lg p-6 w-full animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }
  if (error || !weather) {
    return (
      <div className="rounded-2xl bg-white/30 shadow-lg p-6 w-full text-center text-red-600">
        {error || "No hay datos de clima"}
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow-xl p-6 w-full text-white flex flex-col gap-2" style={{background: '#243b6b', backdropFilter: 'blur(6px)'}}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-6xl font-extrabold leading-none">{weather.temp}°</span>
        <span className="text-sm opacity-80 mt-1">{weather.time.toLocaleString('es-AR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="text-2xl font-bold flex items-center gap-2 mb-1">
        {weather.condition} <span>{weather.icon}</span>
      </div>
      <div className="text-sm opacity-90 mb-1">
        <span className="align-middle">↑ {weather.max}° / ↓ {weather.min}°</span>
      </div>
      <div className="text-sm opacity-80">Sensación Térmica {weather.feels_like}°</div>
    </div>
  );
} 