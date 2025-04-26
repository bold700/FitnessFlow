import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import SeedApp from './scripts/seed';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionEdit from './components/SubscriptionEdit';
import ClientList from './components/ClientList';
import ClientEdit from './components/ClientEdit';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center">
                  <span className="font-semibold text-gray-500 text-lg">FitnessFlow</span>
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/subscriptions" className="py-2 px-3 text-gray-500 hover:text-green-500 transition duration-300">Abonnementen</Link>
                <Link to="/clients" className="py-2 px-3 text-gray-500 hover:text-green-500 transition duration-300">Klanten</Link>
                <Link to="/schedule" className="py-2 px-3 text-gray-500 hover:text-green-500 transition duration-300">Rooster</Link>
                <Link to="/invoices" className="py-2 px-3 text-gray-500 hover:text-green-500 transition duration-300">Facturen</Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-green-500 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="md:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  <Link
                    to="/subscriptions"
                    className="block py-2 px-4 text-gray-500 hover:bg-green-50 hover:text-green-500 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Abonnementen
                  </Link>
                  <Link
                    to="/clients"
                    className="block py-2 px-4 text-gray-500 hover:bg-green-50 hover:text-green-500 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Klanten
                  </Link>
                  <Link
                    to="/schedule"
                    className="block py-2 px-4 text-gray-500 hover:bg-green-50 hover:text-green-500 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Rooster
                  </Link>
                  <Link
                    to="/invoices"
                    className="block py-2 px-4 text-gray-500 hover:bg-green-50 hover:text-green-500 transition duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Facturen
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/subscriptions" replace />} />
            <Route path="/subscriptions" element={<SubscriptionList />} />
            <Route path="/subscriptions/new" element={<SubscriptionEdit />} />
            <Route path="/subscriptions/edit/:id" element={<SubscriptionEdit />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientEdit />} />
            <Route path="/clients/edit/:id" element={<ClientEdit />} />
            <Route path="/schedule" element={<div className="p-4">Rooster Pagina</div>} />
            <Route path="/invoices" element={<div className="p-4">Facturen Pagina</div>} />
            <Route path="/seed" element={<SeedApp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
} 