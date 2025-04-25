import React from 'react';
import ClientList from '../components/clients/ClientList';

export default function ClientsPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Cliënten</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Nieuwe Cliënt
          </button>
        </div>
        <ClientList />
      </div>
    </div>
  );
} 