import React from 'react'
import { Icons } from './icons'

export default function Header() {
  const Bell = Icons.Bell
  const Search = Icons.Search
  const User = Icons.User

  return (
    <header className="w-full flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative w-full max-w-xl">
          <input className="w-full bg-[rgba(255,255,255,0.02)] border border-transparent focus:border-[rgba(255,255,255,0.06)] rounded-xl py-2 pl-10 pr-4 text-sm placeholder:text-white/50 transition" placeholder="Search transactions, assets, entities" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"><Search className="w-4 h-4" /></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition"><Bell className="w-5 h-5" /></button>
        <div className="px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] glass flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-black font-semibold">A</div>
          <div className="text-sm">
            <div className="font-medium">Adam</div>
            <div className="text-xs muted">Wallet: 0xAb...4f2c</div>
          </div>
        </div>
      </div>
    </header>
  )
}
