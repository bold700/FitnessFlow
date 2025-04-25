import React, { useState } from 'react'

export default function Clients() {
  const [clients] = useState([
    { name: 'Marija', subscription: '1x per week', fee: 75, startDate: '2025-03-01' }
  ])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cliënten</h2>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="p-2 border">Naam</th>
            <th className="p-2 border">Abonnement</th>
            <th className="p-2 border">Tarief</th>
            <th className="p-2 border">Startdatum</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index}>
              <td className="p-2 border">{client.name}</td>
              <td className="p-2 border">{client.subscription}</td>
              <td className="p-2 border">€{client.fee}</td>
              <td className="p-2 border">{client.startDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
