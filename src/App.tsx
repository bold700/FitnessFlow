import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-4 items-center">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  FitnessFlow
                </Link>
                <Link to="/clients" className="text-gray-600 hover:text-gray-800">
                  Cliënten
                </Link>
                <Link to="/schedule" className="text-gray-600 hover:text-gray-800">
                  Rooster
                </Link>
                <Link to="/invoices" className="text-gray-600 hover:text-gray-800">
                  Facturen
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<div>Welkom bij FitnessFlow</div>} />
            <Route path="/clients" element={<div>Cliënten Pagina</div>} />
            <Route path="/schedule" element={<div>Rooster Pagina</div>} />
            <Route path="/invoices" element={<div>Facturen Pagina</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
} 