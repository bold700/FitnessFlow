import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SubscriptionType {
  id?: string;
  name: string;
  price: number;
  type: 'personal' | 'group';
  sessionsPerMonth: number;
  features: string[];
  schedule?: string[];
}

export default function SubscriptionList() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionType | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState<SubscriptionType>({
    name: '',
    price: 0,
    type: 'personal',
    sessionsPerMonth: 0,
    features: []
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subscriptionTypes'));
      const subscriptionData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SubscriptionType[];
      setSubscriptions(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subscriptionData = {
        ...formData,
        features: features
      };
      
      if (editingSubscription?.id) {
        await updateDoc(doc(db, 'subscriptionTypes', editingSubscription.id), subscriptionData);
        alert('Abonnement succesvol bijgewerkt!');
      } else {
        await addDoc(collection(db, 'subscriptionTypes'), subscriptionData);
        alert('Abonnement succesvol toegevoegd!');
      }
      
      resetForm();
      fetchSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Er is een fout opgetreden bij het opslaan van het abonnement.');
    }
  };

  const handleEdit = (subscription: SubscriptionType) => {
    if (subscription.id) {
      navigate(`/subscriptions/edit/${subscription.id}`);
    }
  };

  const handleDelete = async (subscriptionId: string) => {
    if (window.confirm('Weet je zeker dat je dit abonnement wilt verwijderen?')) {
      try {
        await deleteDoc(doc(db, 'subscriptionTypes', subscriptionId));
        alert('Abonnement succesvol verwijderd!');
        fetchSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
        alert('Er is een fout opgetreden bij het verwijderen van het abonnement.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      type: 'personal',
      sessionsPerMonth: 0,
      features: []
    });
    setFeatures([]);
    setShowForm(false);
    setEditingSubscription(null);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
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
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Abonnementen</h2>
            <p className="mt-4 text-lg text-gray-600">Beheer je abonnementen</p>
          </div>
          <button
            onClick={() => navigate('/subscriptions/new')}
            className="bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Nieuw Abonnement</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-0 mx-auto p-5 w-full max-w-3xl">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingSubscription ? 'Abonnement Bewerken' : 'Nieuw Abonnement'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Naam
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="bijv. Personal Training 4x"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prijs per maand (€)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'personal' | 'group'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="personal">Personal Training</option>
                      <option value="group">Groepstraining</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sessies per maand
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.sessionsPerMonth}
                      onChange={(e) => setFormData({...formData, sessionsPerMonth: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Voeg een feature toe"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Toevoegen
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {editingSubscription ? 'Opslaan' : 'Toevoegen'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription) => (
            <div 
              key={subscription.id} 
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{subscription.name}</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {subscription.type === 'personal' ? 'Personal' : 'Groep'}
                  </span>
                </div>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">€{subscription.price}</span>
                  <span className="ml-2 text-gray-500">/maand</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-center bg-green-50 rounded-lg p-3">
                    <span className="text-lg font-medium text-green-700">
                      {subscription.sessionsPerMonth}x per maand
                    </span>
                  </div>
                </div>

                {subscription.features && subscription.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Inbegrepen:</h4>
                    <ul className="space-y-3">
                      {subscription.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {subscription.schedule && subscription.schedule.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Beschikbare tijden:</h4>
                    <ul className="space-y-2">
                      {subscription.schedule.map((time, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                          <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {time}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto pt-8 flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(subscription)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Bewerken
                  </button>
                  <button
                    onClick={() => subscription.id && handleDelete(subscription.id)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Verwijderen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 