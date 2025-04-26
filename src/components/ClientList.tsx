import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Subscription {
  id: string;
  name: string;
  type: 'personal' | 'group';
  price: number;
}

interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subscriptionIds: string[];
  startDate: string;
  status: 'active' | 'inactive';
}

export default function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [subscriptions, setSubscriptions] = useState<{ [key: string]: Subscription }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Haal eerst alle abonnementen op
      const subsSnapshot = await getDocs(collection(db, 'subscriptionTypes'));
      const subsData = subsSnapshot.docs.reduce((acc, doc) => ({
        ...acc,
        [doc.id]: { id: doc.id, ...doc.data() } as Subscription
      }), {});
      console.log('Opgehaalde abonnementen:', subsData);
      setSubscriptions(subsData);

      // Haal daarna alle klanten op
      const clientsSnapshot = await getDocs(collection(db, 'clients'));
      const clientsData = clientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      console.log('Opgehaalde klanten:', clientsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (window.confirm('Weet je zeker dat je deze klant wilt verwijderen?')) {
      try {
        await deleteDoc(doc(db, 'clients', clientId));
        alert('Klant succesvol verwijderd!');
        fetchData();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Er is een fout opgetreden bij het verwijderen van de klant.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Klanten</h2>
            <p className="mt-4 text-lg text-gray-600">Beheer je klanten</p>
          </div>
          <button
            onClick={() => navigate('/clients/new')}
            className="bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nieuwe Klant</span>
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefoon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abonnementen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startdatum</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => {
                  console.log('Client data:', client);
                  console.log('Client subscriptionIds:', client.subscriptionIds);
                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.firstName} {client.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {client.subscriptionIds && client.subscriptionIds.length > 0 ? (
                            client.subscriptionIds.map(subId => {
                              const subscription = subscriptions[subId];
                              console.log('Subscription data for ID:', subId, subscription);
                              return subscription ? (
                                <div key={subId} className="flex items-center">
                                  <span className="text-sm text-gray-900">{subscription.name}</span>
                                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    subscription.type === 'personal' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {subscription.type === 'personal' ? 'Persoonlijk' : 'Groep'}
                                  </span>
                                </div>
                              ) : null;
                            })
                          ) : (
                            <span className="text-sm text-gray-500">Geen abonnementen</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.status === 'active' ? 'Actief' : 'Inactief'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.startDate).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => client.id && navigate(`/clients/edit/${client.id}`)}
                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-full transition-colors group"
                            title="Bewerken"
                          >
                            <svg 
                              className="w-5 h-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => client.id && handleDelete(client.id)}
                            className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors group"
                            title="Verwijderen"
                          >
                            <svg 
                              className="w-5 h-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 