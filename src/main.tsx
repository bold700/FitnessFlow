import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Check if we're running the seeder
const isSeeder = window.location.pathname === '/seed'
const Seeder = React.lazy(() => import('./scripts/seed').then(module => ({ default: module.SeedApp })))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {isSeeder ? (
        <Suspense fallback={<div>Loading seeder...</div>}>
          <Seeder />
        </Suspense>
      ) : (
        <App />
      )}
    </BrowserRouter>
  </React.StrictMode>,
) 