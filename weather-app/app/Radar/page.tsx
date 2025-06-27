'use client';

import React, { useState } from "react";
import { CloudRain, Flame, Wind, Home, Radar as RadarIcon, Camera, Calendar, Search } from 'lucide-react';
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RadarPage() {
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center bg-cover bg-center bg-no-repeat animated-bg" style={{ backgroundImage: 'url("/fondo-clima.png")' }}>
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-slate-700/80 backdrop-blur-sm flex items-center justify-between p-4 md:p-6">
        <h1 className="text-white text-lg md:text-xl lg:text-2xl font-semibold">Weather</h1>
        <button className="text-white">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
        </button>
      </div>
      <div className="flex-1 w-full min-h-screen px-2 pt-20 pb-20">
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
                  }}
                  inline
                  calendarClassName="!bg-[#222E47]"
                  dayClassName={() => '!bg-[#222E47]'}
                  monthClassName={() => '!bg-[#222E47]'}
                  yearClassName={() => '!bg-[#222E47]'}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 p-4 md:p-6 pb-32">
          {[
            {
              key: 'rain',
              content: (
                <div className="bg-slate-700/90 rounded-3xl p-4 md:p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-base md:text-lg">Precipitaciones</span>
                      <CloudRain className="h-5 w-5 md:h-6 md:w-6 text-blue-300" />
                    </div>
                    <span className="text-xs md:text-sm text-gray-300">mar, 14:50</span>
                  </div>
                  <div className="flex gap-2">
                    <img src="https://placehold.co/80x60" alt="mapa1" className="rounded-xl object-cover w-1/2 max-w-full" />
                    <img src="https://placehold.co/80x60" alt="mapa2" className="rounded-xl object-cover w-1/2 max-w-full" />
                  </div>
                </div>
              )
            },
            {
              key: 'fire',
              content: (
                <div className="bg-slate-700/90 rounded-3xl p-4 md:p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-base md:text-lg">Incendios</span>
                      <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />
                    </div>
                    <span className="text-xs md:text-sm text-gray-300">mar, 14:50</span>
                  </div>
                  <div className="flex gap-2">
                    <img src="https://placehold.co/80x60" alt="mapa1" className="rounded-xl object-cover w-1/2 max-w-full" />
                    <img src="https://placehold.co/80x60" alt="mapa2" className="rounded-xl object-cover w-1/2 max-w-full" />
                  </div>
                </div>
              )
            },
            {
              key: 'wind',
              content: (
                <div className="bg-slate-700/90 rounded-3xl p-4 md:p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-base md:text-lg">Vientos</span>
                      <Wind className="h-5 w-5 md:h-6 md:w-6 text-cyan-300" />
                    </div>
                    <span className="text-xs md:text-sm text-gray-300">mar, 14:50</span>
                  </div>
                  <div className="flex gap-2">
                    <img src="https://placehold.co/80x60" alt="mapa1" className="rounded-xl object-cover w-1/2 max-w-full" />
                    <img src="https://placehold.co/80x60" alt="mapa2" className="rounded-xl object-cover w-1/2 max-w-full" />
                  </div>
                </div>
              )
            }
          ].map((card, index) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {card.content}
            </motion.div>
          ))}
        </div>
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-700/80 backdrop-blur-sm">
          <div className="flex items-center justify-around py-4">
            <Link href="/">
              <button className="flex flex-col items-center gap-1 text-white text-xs md:text-sm btn-tap-dark">
                <Home className="h-5 w-5 md:h-6 md:w-6 icon-animate" />
                <span>Home</span>
              </button>
            </Link>
            <Link href="/Radar">
              <button className="flex flex-col items-center gap-1 text-white text-xs md:text-sm btn-tap-dark">
                <RadarIcon className="h-5 w-5 md:h-6 md:w-6 icon-animate icon-rotate" />
                <span>Radar</span>
              </button>
            </Link>
            <button className="flex flex-col items-center gap-1 text-white text-xs md:text-sm btn-tap-dark">
              <Camera className="h-5 w-5 md:h-6 md:w-6 icon-animate" />
              <span>Fotos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}