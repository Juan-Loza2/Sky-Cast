'use client';

import React, { useState } from "react";
import { CloudRain, Flame, Wind, Home, Radar as RadarIcon, Camera, Calendar, Search } from 'lucide-react';
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RadarPage() {
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <div className="px-4 py-2 w-full max-w-sm">
        <p className="text-gray-400 text-sm">Android-Mobile</p>
      </div>
      <div className="flex-1 w-full max-w-sm mx-auto bg-cover bg-center bg-no-repeat rounded-t-3xl min-h-screen" style={{ backgroundImage: 'url("/fondo-clima.png")' }}>
        <div className="flex items-center justify-between p-4 bg-slate-700/80 backdrop-blur-sm rounded-t-3xl">
          <h1 className="text-white text-lg font-semibold">Weather</h1>
          <button className="text-white">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
          </button>
        </div>
        {/* Search and Calendar Bar */}
        <div className="flex gap-2 items-center px-4 pt-4 pb-2">
          <div className="flex-1 flex items-center bg-slate-700/80 rounded-xl px-2">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none text-white flex-1 py-2"
            />
          </div>
          <div className="relative">
            <button
              className="bg-slate-700/80 rounded-xl p-2 flex items-center justify-center"
              onClick={() => setShowCalendar((v) => !v)}
            >
              <Calendar className="h-5 w-5 text-gray-400" />
            </button>
            {showCalendar && (
              <div className="absolute right-0 z-50 mt-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    if (date) setStartDate(date);
                    setShowCalendar(false);
                  }}
                  inline
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4 pb-32">
          {/* Card Precipitaciones */}
          <div className="bg-slate-700/90 rounded-3xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Precipitaciones</span>
                <CloudRain className="h-5 w-5 text-blue-300" />
              </div>
              <span className="text-xs text-gray-300">mar, 14:50</span>
            </div>
            <div className="flex gap-2">
              <img src="https://placehold.co/80x60" alt="mapa1" className="rounded-xl object-cover w-1/2" />
              <img src="https://placehold.co/80x60" alt="mapa2" className="rounded-xl object-cover w-1/2" />
            </div>
          </div>
          {/* Card Incendios */}
          <div className="bg-slate-700/90 rounded-3xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Incendios</span>
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-xs text-gray-300">mar, 14:50</span>
            </div>
            <div className="flex gap-2">
              <img src="https://placehold.co/80x60" alt="mapa1" className="rounded-xl object-cover w-1/2" />
              <img src="https://placehold.co/80x60" alt="mapa2" className="rounded-xl object-cover w-1/2" />
            </div>
          </div>
          {/* Card Vientos */}
          <div className="bg-slate-700/90 rounded-3xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Vientos</span>
                <Wind className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="text-xs text-gray-300">mar, 14:50</span>
            </div>
            <div className="flex gap-2">
              <img src="https://placehold.co/80x60" alt="mapa1" className="rounded-xl object-cover w-1/2" />
              <img src="https://placehold.co/80x60" alt="mapa2" className="rounded-xl object-cover w-1/2" />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="bg-slate-700/80 backdrop-blur-sm rounded-t-3xl w-full max-w-sm mx-auto">
        <div className="flex items-center justify-around py-4">
          <Link href="/">
            <button className="flex flex-col items-center gap-1 text-white">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </button>
          </Link>
          <button className="flex flex-col items-center gap-1 text-white">
            <Link href="/Radar">
              <button className="flex flex-col items-center gap-1 text-white">
                <RadarIcon className="h-5 w-5" />
                <span className="text-xs">Radar</span>
              </button>
            </Link>
          </button>
          <button className="flex flex-col items-center gap-1 text-white">
            <Camera className="h-5 w-5" />
            <span className="text-xs">Fotos</span>
          </button>
        </div>
      </div>
    </div>
  );
}