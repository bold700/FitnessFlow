import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SubscriptionFormData {
  name: string;
  price: number;
  type: 'personal' | 'group';
  sessionsPerMonth: number;
  features: string[];
}

interface Subscription extends SubscriptionFormData {
  id: string;
}

export default function SubscriptionManager() {
  const [showForm, setShowForm] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<SubscriptionFormData>({
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
      })) as Subscription[];
      setSubscriptions(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subscriptionData = {
        ...formData,
        features: features
      };
      
      if (editingSubscription) {
        // Update bestaand abonnement
        await updateDoc(doc(db, 'subscriptionTypes', editingSubscription.id), subscriptionData);
        alert('Abonnement succesvol bijgewerkt!');
      } else {
        // Voeg nieuw abonnement toe
        await addDoc(collection(db, 'subscriptionTypes'), subscriptionData);
        alert('Abonnement succesvol toegevoegd!');
      }
      
      // Reset form en refresh data
      resetForm();
      fetchSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Er is een fout opgetreden bij het opslaan van het abonnement.');
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      name: subscription.name,
      price: subscription.price,
      type: subscription.type,
      sessionsPerMonth: subscription.sessionsPerMonth,
      features: subscription.features
    });
    setFeatures(subscription.features || []);
    setShowForm(true);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Abonnementen Beheer</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          {showForm ? 'Annuleren' : 'Nieuw Abonnement'}
        </button>
      </div>

      {/* Lijst van bestaande abonnementen */}
      {!showForm && (
        <div className="grid grid-cols-1 gap-4 mb-8">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{subscription.name}</h3>
                  <p className="text-gray-600">€{subscription.price} / maand</p>
                  <p className="text-gray-600">{subscription.sessionsPerMonth}x per maand</p>
                  <p className="text-gray-600">{subscription.type === 'personal' ? 'Personal Training' : 'Groepstraining'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(subscription)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleDelete(subscription.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
              {subscription.features && subscription.features.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-gray-700">Features:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {subscription.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
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

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="mr-3 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                {editingSubscription ? 'Abonnement Bijwerken' : 'Abonnement Toevoegen'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
} 