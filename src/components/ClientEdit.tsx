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
  type: 'personal' | 'group';
  price: number;
  sessionsPerMonth?: number;
  features?: string[];
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
      console.log('Fetching subscriptions...');
      const querySnapshot = await getDocs(collection(db, 'subscriptionTypes'));
      console.log('Raw subscription docs:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const subscriptionData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscription[];
      console.log('Processed subscriptions:', subscriptionData);
      setSubscriptions(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const fetchClient = async () => {
    try {
      if (!id) return;
      console.log('Fetching client with ID:', id);
      const docRef = doc(db, 'clients', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const clientData = docSnap.data();
        console.log('Retrieved client data:', clientData);
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
    
    if (!formData.subscriptionIds.length) {
      alert('Selecteer minimaal één abonnement voor de klant.');
      return;
    }

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
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return;

    setFormData(prev => {
      const currentSubscriptions = subscriptions.filter(s => prev.subscriptionIds.includes(s.id));
      const isSelected = prev.subscriptionIds.includes(subscriptionId);

      // Als we dit abonnement willen deselecteren
      if (isSelected) {
        return {
          ...prev,
          subscriptionIds: prev.subscriptionIds.filter(id => id !== subscriptionId)
        };
      }

      // Als we een nieuw abonnement selecteren
      let newSubscriptionIds = [...prev.subscriptionIds];

      // Verwijder bestaande abonnementen van hetzelfde type
      if (subscription.type === 'personal') {
        newSubscriptionIds = newSubscriptionIds.filter(id => {
          const sub = subscriptions.find(s => s.id === id);
          return sub?.type !== 'personal';
        });
      } else if (subscription.type === 'group') {
        newSubscriptionIds = newSubscriptionIds.filter(id => {
          const sub = subscriptions.find(s => s.id === id);
          return sub?.type !== 'group';
        });
      }

      // Voeg het nieuwe abonnement toe
      newSubscriptionIds.push(subscriptionId);

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
          <p className="mt-2 text-sm text-gray-600">
            * Selecteer minimaal één abonnement. Je kunt maximaal één Personal Training en één Small Group Training abonnement kiezen.
          </p>
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
                Abonnementen * ({subscriptions.length} beschikbaar)
              </label>
              <div className="bg-white rounded-lg border border-gray-300 divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                {subscriptions.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    Geen abonnementen gevonden. Maak eerst een abonnement aan.
                  </div>
                ) : (
                  subscriptions.map((subscription) => {
                    const isSelected = formData.subscriptionIds.includes(subscription.id);
                    const isPersonal = subscription.type === 'personal';
                    return (
                      <div 
                        key={subscription.id} 
                        className={`p-4 hover:bg-gray-50 transition-colors relative ${
                          isSelected ? `${isPersonal ? 'bg-blue-50' : 'bg-green-50'}` : ''
                        }`}
                      >
                        <label className="flex items-center gap-4 cursor-pointer w-full group">
                          <div className="relative flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                              isSelected 
                                ? (isPersonal ? 'border-blue-500 bg-blue-500' : 'border-green-500 bg-green-500')
                                : 'border-gray-300 group-hover:border-gray-400'
                            }`}>
                              {isSelected && (
                                <svg 
                                  className="w-4 h-4 mx-auto mt-0.5 text-white" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M5 13l4 4L19 7" 
                                  />
                                </svg>
                              )}
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSubscriptionToggle(subscription.id)}
                              className="sr-only"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="text-base font-medium text-gray-900">{subscription.name}</span>
                              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                isPersonal
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {isPersonal ? 'Personal Training' : 'Small Group Training'}
                              </span>
                            </div>
                            {subscription.sessionsPerMonth && (
                              <p className="text-sm text-gray-500 mt-1">
                                {subscription.sessionsPerMonth}x per maand
                              </p>
                            )}
                          </div>
                          <div className="text-base font-medium text-gray-900">
                            €{subscription.price}/maand
                          </div>
                        </label>
                      </div>
                    );
                  })
                )}
              </div>
              {formData.subscriptionIds.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Selecteer minimaal één abonnement
                </p>
              )}
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {id ? 'Opslaan' : 'Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 