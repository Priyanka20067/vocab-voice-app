import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container, Box, Alert, Snackbar } from '@mui/material'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './hooks/useAuth'

function AppContent() {
  const { user, loading } = useAuth()
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <div>Loading...</div>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Home showNotification={showNotification} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/quiz/:sessionId" 
            element={user ? <Quiz showNotification={showNotification} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/results/:sessionId" 
            element={user ? <Results showNotification={showNotification} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile showNotification={showNotification} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login showNotification={showNotification} /> : <Navigate to="/" />} 
          />
        </Routes>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App