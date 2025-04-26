import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

interface Subscription {
  id: string;
  name: string;
}

export default function ClientEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [formData, setFormData] = useState<Client>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subscriptionIds: [],
    startDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    fetchSubscriptions();
    if (id) {
      fetchClient();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchSubscriptions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subscriptionTypes'));
      const subscriptionData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscription[];
      setSubscriptions(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchClient = async () => {
    try {
      if (!id) return;
      const docRef = doc(db, 'clients', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const clientData = docSnap.data();
        setFormData({
          ...clientData,
          subscriptionIds: clientData.subscriptionIds || [],
          startDate: clientData.startDate || new Date().toISOString().split('T')[0]
        } as Client);
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientData = {
        ...formData,
        subscriptionIds: formData.subscriptionIds || []
      };
      
      if (id) {
        await setDoc(doc(db, 'clients', id), clientData);
      } else {
        await setDoc(doc(collection(db, 'clients')), clientData);
      }
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleSubscriptionToggle = (subscriptionId: string) => {
    setFormData(prev => {
      const newSubscriptionIds = prev.subscriptionIds.includes(subscriptionId)
        ? prev.subscriptionIds.filter(id => id !== subscriptionId)
        : [...prev.subscriptionIds, subscriptionId];
      return { ...prev, subscriptionIds: newSubscriptionIds };
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <Link to="/clients" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Terug naar overzicht
      </Link>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Klant Bewerken' : 'Nieuwe Klant'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Voornaam
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Achternaam
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefoon
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abonnementen
              </label>
              <div className="bg-white rounded-md border border-gray-300 divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="p-4 flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id={`subscription-${subscription.id}`}
                      checked={formData.subscriptionIds.includes(subscription.id)}
                      onChange={() => handleSubscriptionToggle(subscription.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`subscription-${subscription.id}`}
                      className="flex-grow flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{subscription.name}</p>
                        <p className="text-sm text-gray-500">
                          {(subscription as any).type === 'personal' ? 'Personal Training' : 'Groepstraining'} - {(subscription as any).sessionsPerMonth}x per maand
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        €{(subscription as any).price}/maand
                      </p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Startdatum
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
              >
                <option value="active">Actief</option>
                <option value="inactive">Inactief</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {id ? 'Opslaan' : 'Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 