import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Client {
  id: string;
  name: string;
  email: string;
  subscriptionType: 'weekly' | 'flex' | 'single';
  subscriptionStartDate: Date;
  monthlyRate: number;
  lastInvoiceDate: Date | null;
  lastInvoiceNumber: string | null;
  isPaid: boolean;
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const q = query(collection(db, 'clients'), orderBy('name'));
        const querySnapshot = await getDocs(q);
        const clientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          subscriptionStartDate: doc.data().subscriptionStartDate?.toDate(),
          lastInvoiceDate: doc.data().lastInvoiceDate?.toDate()
        })) as Client[];
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Naam
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Abonnement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Maandtarief
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {client.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.subscriptionType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                €{client.monthlyRate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  client.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {client.isPaid ? 'Betaald' : 'Niet betaald'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 