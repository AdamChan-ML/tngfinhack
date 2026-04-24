import React from 'react'

export default function Transactions({ data = [] }: { data?: Array<any> }) {
  const rows = data.length ? data : [
    { date: '2026-04-21', entity: 'Binance', amount: '-$1,200', status: 'Settled' },
    { date: '2026-04-20', entity: 'Coinbase', amount: '+$3,450', status: 'Pending' },
    { date: '2026-04-18', entity: 'Robinhood', amount: '-$230', status: 'Failed' },
  ]

  return (
    <div className="glass p-4 rounded-xl">
      <h4 className="font-semibold mb-3">Recent Transactions</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead className="text-left text-white/60">
            <tr>
              <th className="pb-2">Date</th>
              <th className="pb-2">Entity</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)] transition">
                <td className="py-3">{r.date}</td>
                <td className="py-3">{r.entity}</td>
                <td className={`py-3 font-medium ${r.amount.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>{r.amount}</td>
                <td className="py-3 text-xs muted">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
