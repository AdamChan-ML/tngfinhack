import React from 'react'
import { Icons } from './icons'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  { key: 'transactions', label: 'Transactions', icon: Icons.Transactions },
  { key: 'portfolio', label: 'Portfolio', icon: Icons.Portfolio },
  { key: 'analytics', label: 'Analytics', icon: Icons.Analytics },
  { key: 'settings', label: 'Settings', icon: Icons.Settings },
]

export default function Sidebar({ active = 'dashboard' }: { active?: string }) {
  return (
    <aside className="w-72 p-4 flex flex-col gap-6">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-black font-bold">TF</div>
        <div>
          <h3 className="text-lg font-semibold">TngFinHack</h3>
          <p className="text-sm muted">Finance Dashboard</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <li key={item.key}>
                <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-[rgba(5,150,105,0.12)] text-primary' : 'text-white/80 hover:bg-[rgba(255,255,255,0.02)]'}`}>
                  <Icon className="w-5 h-5" />
                  <span className="ml-1">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="text-sm muted">v0.1 • 48h</div>
    </aside>
  )
}
