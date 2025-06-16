import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { useKV } from '@github/spark/hooks'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useKV('isAuthenticated', false)

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" /> : 
                <LoginPage onLogin={() => setIsAuthenticated(true)} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard onLogout={() => setIsAuthenticated(false)} /> : 
                <Navigate to="/" />
            } 
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App