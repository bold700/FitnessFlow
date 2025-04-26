import React from 'react';
import SubscriptionManager from '../components/SubscriptionManager';

const SubscriptionManagerPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Abonnementen Beheren</h1>
      <SubscriptionManager />
    </div>
  );
};

export default SubscriptionManagerPage; 