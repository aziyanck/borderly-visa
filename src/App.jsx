import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ApplicationProvider } from './context/ApplicationContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CountrySearchPage from './pages/CountrySearchPage'
import PassportEntryPage from './pages/PassportEntryPage'
import VisaWizardPage from './pages/VisaWizardPage'
import PaymentPage from './pages/PaymentPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'

// Protects routes that require authentication
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Redirects to dashboard if already logged in
function GuestRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></div>
      </div>
    )
  }

  // For login page, if logged in redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Home route - shows different content based on auth status
function HomeRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></div>
      </div>
    )
  }

  // If logged in, show dashboard
  if (user) {
    return <DashboardPage />
  }

  // If guest, show public homepage
  return <HomePage />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public home - shows HomePage for guests, Dashboard for logged-in users */}
      <Route path="/" element={<HomeRoute />} />

      {/* Dashboard for logged-in users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      {/* Login page - redirects to dashboard if already logged in */}
      <Route path="/login" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />

      {/* Country search - accessible to everyone */}
      <Route path="/search" element={<CountrySearchPage />} />

      {/* Passport entry - accessible to everyone (guest can start application) */}
      <Route path="/passport/:applicationId" element={<PassportEntryPage />} />

      {/* Visa wizard - accessible to everyone */}
      <Route path="/wizard/:applicationId" element={<VisaWizardPage />} />

      {/* Payment - REQUIRES LOGIN */}
      <Route path="/payment/:applicationId" element={
        <ProtectedRoute>
          <PaymentPage />
        </ProtectedRoute>
      } />

      {/* Application detail - requires login */}
      <Route path="/application/:applicationId" element={
        <ProtectedRoute>
          <ApplicationDetailPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApplicationProvider>
          <AppRoutes />
        </ApplicationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
