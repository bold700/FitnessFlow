import React, { useState } from 'react';
import { seedSubscriptionTypes } from '../lib/seedSubscriptions';

function SeedApp() {
  const [status, setStatus] = useState('');

  const handleSeed = async () => {
    try {
      setStatus('Bezig met seeden...');
      await seedSubscriptionTypes();
      setStatus('Seeding succesvol voltooid!');
    } catch (error) {
      console.error('Error during seeding:', error);
      setStatus('Er is een fout opgetreden tijdens het seeden.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="rounded-lg bg-white p-8 shadow-md text-center">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          FitnessFlow Database Seeder
        </h1>
        <button
          onClick={handleSeed}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Seed Subscription Types
        </button>
        {status && (
          <p className="mt-4 text-gray-600">{status}</p>
        )}
      </div>
    </div>
  );
}

export default SeedApp;