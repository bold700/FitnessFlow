import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionList from '../components/SubscriptionList';

const Subscriptions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Abonnementen</h1>
        <button
          onClick={() => navigate('/subscriptions/manage')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Nieuw Abonnement
        </button>
      </div>
      <SubscriptionList />
    </div>
  );
};

export default Subscriptions; 