import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { StatCard } from '../components/StatCards'
import { PerformanceChart, AllocationDonut } from '../components/Charts'
import Transactions from '../components/Transactions'

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 grid grid-cols-3 gap-4">
            <StatCard title="Total Balance" value="$124,560" delta="+4.2%" positive />
            <StatCard title="Monthly Profit" value="$4,320" delta="+12.3%" positive />
            <StatCard title="Active Assets" value="12" />
          </div>

          <div className="col-span-12 xl:col-span-8">
            <PerformanceChart />
          </div>

          <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
            <AllocationDonut />
            <Transactions />
          </div>
        </div>
      </main>
    </div>
  )
}
