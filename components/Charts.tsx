import React from 'react'
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const performanceData = Array.from({ length: 30 }).map((_, i) => ({
  day: i,
  value: 1000 + Math.sin(i / 3) * 50 + i * 5,
}))

const allocationData = [
  { name: 'Stocks', value: 55 },
  { name: 'Bonds', value: 20 },
  { name: 'Crypto', value: 15 },
  { name: 'Cash', value: 10 },
]

const COLORS = ['#059669', '#10b981', '#34d399', '#94f7c9']

export function PerformanceChart() {
  return (
    <div className="w-full h-72 glass p-4 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={performanceData}>
          <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AllocationDonut() {
  return (
    <div className="w-full h-56 glass p-4 rounded-xl flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={allocationData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} fill="#8884d8">
            {allocationData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
