import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SubscriptionFormData {
  name: string;
  price: number;
  type: 'personal' | 'group';
  sessionsPerMonth: number;
  features: string[];
}

export default function SubscriptionEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    price: 0,
    type: 'personal',
    sessionsPerMonth: 0,
    features: []
  });

  useEffect(() => {
    if (id) {
      // Bestaand abonnement ophalen
      const fetchSubscription = async () => {
        const docRef = doc(db, 'subscriptionTypes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as SubscriptionFormData;
          setFormData(data);
          setFeatures(data.features || []);
        }
      };
      fetchSubscription();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subscriptionData = {
        ...formData,
        features: features
      };
      
      if (id) {
        // Update bestaand abonnement
        await updateDoc(doc(db, 'subscriptionTypes', id), subscriptionData);
        alert('Abonnement succesvol bijgewerkt!');
      } else {
        // Voeg nieuw abonnement toe
        await addDoc(collection(db, 'subscriptionTypes'), subscriptionData);
        alert('Abonnement succesvol toegevoegd!');
      }
      
      navigate('/subscriptions');
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Er is een fout opgetreden bij het opslaan van het abonnement.');
    }
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
    <div className="page-container py-8">
      <Link to="/subscriptions" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Terug naar overzicht
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Abonnement Bewerken' : 'Nieuw Abonnement'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naam
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
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
              className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
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
              className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
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
              className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4"
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
                className="flex-1 h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Voeg een feature toe"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 h-12 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
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

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/subscriptions')}
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