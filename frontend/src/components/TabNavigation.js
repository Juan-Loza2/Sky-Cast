"use client"

import { Thermometer, Flame, Wind, Activity } from "lucide-react"
import { motion } from "framer-motion"

const TabNavigation = ({ activeTab, onTabChange, estadisticas }) => {
  const tabs = [
    {
      id: "WRF",
      label: "WRF",
      icon: Thermometer,
      description: "Modelo meteorológico",
      count: estadisticas?.variables_wrf?.length || 0,
    },
    {
      id: "FWI",
      label: "FWI",
      icon: Flame,
      description: "Índice de peligro de incendio",
      count: 1,
    },
    {
      id: "Gases",
      label: "Gases",
      icon: Activity,
      description: "Medición de gases",
      count: 2,
    },
    {
      id: "Vientos",
      label: "Vientos",
      icon: Wind,
      description: "Ráfagas en rutas",
      count: 1,
    },
  ]

  return (
    <div className="rounded-2xl shadow-2xl p-4 flex justify-center text-[var(--color-text)] mb-6"
         style={{ background: '[var(--color-bg)]', backdropFilter: 'blur(6px)', boxShadow: '0 8px 12px 0 rgba(0,0,0,0.35)' }}>
      <div className="flex flex-wrap gap-3 justify-center relative text-[var(--color-text)]">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 py-4 rounded-full font-semibold text-lg md:text-xl flex items-center gap-2 transition-all duration-200 min-w-[140px]
                ${isActive ? "button-primary text-[var(--color-text)] shadow-lg" : "button text-[var(--color-text)] hover:bg-blue-50"}
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[var(--color-text)]" : "text-blue-600"}`} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute left-4 right-4 -bottom-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabNavigation
