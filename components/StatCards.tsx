import React from 'react'
import { Line } from 'recharts'

type StatCardProps = {
  title: string
  value: string
  delta?: string
  positive?: boolean
}

export function StatCard({ title, value, delta, positive }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl glass-strong">
      <div className="text-sm muted">{title}</div>
      <div className="flex items-center gap-3 mt-2">
        <div className="text-2xl font-semibold">{value}</div>
        {delta && (
          <div className={`text-sm font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>{delta}</div>
        )}
      </div>
      <div className="mt-3">
        {/* placeholder for sparkline */}
        <div className="w-full h-10 bg-[rgba(255,255,255,0.02)] rounded-md" />
      </div>
    </div>
  )
}
