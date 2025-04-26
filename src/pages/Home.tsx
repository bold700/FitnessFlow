import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Welkom bij FitnessFlow</h1>
      <p className="text-xl text-gray-600 mb-8">
        Beheer je fitness studio eenvoudig en efficiënt
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Abonnementen</h2>
          <p className="text-gray-600">Beheer alle abonnementen en prijzen</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Klanten</h2>
          <p className="text-gray-600">Houd je klantenbestand bij</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Schema</h2>
          <p className="text-gray-600">Plan trainingen en sessies</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 