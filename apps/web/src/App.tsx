import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, lazy, Suspense } from 'react'

// Import feature components
import { Home } from './pages/Home'
import { LibrarySimple } from './features/library/LibrarySimple'
import { GameDetailsPage } from './features/library/pages/GameDetailsPage'
import { Identity } from './pages/Identity'
import { Integrations } from './features/integrations/Integrations'
import { Analytics } from './pages/Analytics'
import { InsightsDashboard } from './pages/InsightsDashboard'
import Donate from './pages/Donate'
import { useAuth } from './store/authStore'
import { useLibraryStore } from './stores/useLibraryStore'
import ProtectedRoute from './components/ProtectedRoute'
import SteamCallback from './pages/SteamCallback'
import Login from './pages/Login'
import Register from './pages/Register'
import { Navigation } from './components/Navigation'
import { MobileLayout } from './components/MobileLayout'
import { ToastProvider } from './components/ui/ToastProvider'
import { ErrorBoundary, PageErrorBoundary } from './components/ErrorBoundary'
import TourManager from './components/TourManager'
import HelpDocumentation from './features/help/HelpDocumentation'
import HelpButton from './components/HelpButton'
import { LoadingProvider, GlobalLoadingOverlay } from './components/LoadingManager'
import { CustomisationProvider } from './features/customisation/CustomisationProvider'
import { CustomisationPage } from './features/customisation/CustomisationPage'
import SplashScreen from './components/SplashScreen'
import { BetaOnboarding } from './components/onboarding/BetaOnboarding'
import { BetaFeedback, FeedbackButton } from './components/feedback/BetaFeedback'
import { initializePersonaTestConsole } from './utils/personaTestConsole'
import './utils/debugGameData'
import './utils/quickGenreFix'
import './App.css'

// Lazy load heavy components
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  const { isAuthenticated, user, isLoading, initializeAuth } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [showBetaOnboarding, setShowBetaOnboarding] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // Initialize authentication on app load
  useEffect(() => {
    // Initialize persona test console for development
    if (process.env.NODE_ENV === 'development') {
      initializePersonaTestConsole()
    }

    // Initialize authentication (will use mock user in development)
    initializeAuth()

    // Check if user has completed beta onboarding
    const hasCompletedOnboarding = localStorage.getItem('beta_onboarding_completed')
    // TEMPORARILY FORCE ONBOARDING - REMOVE TO USE NORMAL LOGIC
    if (!hasCompletedOnboarding || true) { // <-- Added || true to force onboarding
      setShowBetaOnboarding(true)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    // Removed localStorage setting
  }

  const handleBetaOnboardingComplete = () => {
    setShowBetaOnboarding(false)
    localStorage.setItem('beta_onboarding_completed', 'true')
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Global App Error:', error, errorInfo)
        // In production, this would send to error tracking service
      }}
    >
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <ToastProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              {/* Show splash screen on first load */}
              {showSplash ? (
                <SplashScreen onComplete={handleSplashComplete} />
              ) : showBetaOnboarding ? (
                <BetaOnboarding 
                  onComplete={handleBetaOnboardingComplete}
                  skipOnboarding={false}
                />
              ) : (
                <>
                  <AppContent 
                    isAuthenticated={isAuthenticated} 
                    user={user} 
                    isLoading={isLoading} 
                    initializeAuth={initializeAuth} 
                  />
                  <TourManager />
                  <GlobalLoadingOverlay />
                  {/* Beta Feedback System */}
                  <FeedbackButton onClick={() => setShowFeedback(true)} />
                  <BetaFeedback 
                    isOpen={showFeedback} 
                    onClose={() => setShowFeedback(false)}
                    userId={user?.id}
                  />
                </>
              )}
            </Router>
          </ToastProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

function AppContent({ isAuthenticated, user, isLoading, initializeAuth }: any) {
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const { actions: libraryActions } = useLibraryStore()

  useEffect(() => {
    // Only fetch once on initial load if not loading and no user
    if (!isLoading && !user && !hasAttemptedFetch) {
      setHasAttemptedFetch(true)
      initializeAuth()
    }
  }, [isLoading, user, hasAttemptedFetch, initializeAuth])

  // Load library when user is authenticated
  useEffect(() => {
    // Load games for development (with or without authentication)
    console.log('🎮 Loading library...')
    libraryActions.loadGames()
  }, [libraryActions])

  return (
    <div className="min-h-screen">
      {/* Navigation - Always show since it handles both auth states */}
      <Navigation 
        isAuthenticated={isAuthenticated}
        user={user}
      />
    
      {/* Main Content with Mobile Layout */}
      <Routes>
        {/* Public routes - no MobileLayout wrapper */}
        <Route path="/login" element={
          <PageErrorBoundary>
            <Login />
          </PageErrorBoundary>
        } />
        <Route path="/register" element={
          <PageErrorBoundary>
            <Register />
          </PageErrorBoundary>
        } />
        <Route path="/auth/callback/steam" element={
          <PageErrorBoundary>
            <SteamCallback />
          </PageErrorBoundary>
        } />
        <Route path="/donate" element={
          <PageErrorBoundary>
            <Donate />
          </PageErrorBoundary>
        } />
        
        {/* Protected routes - wrapped with MobileLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={true}>
                <CustomisationProvider>
                  <Home />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/library" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={true}>
                <CustomisationProvider>
                  <LibrarySimple />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/library/add" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <LibrarySimple />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/library/game/:gameId" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <GameDetailsPage />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/identity" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <Identity />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <Analytics />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/insights" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <InsightsDashboard />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/integrations" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <Integrations />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Settings />
                  </Suspense>
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/customisation" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <CustomisationPage />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/help" element={
          <ProtectedRoute>
            <PageErrorBoundary>
              <MobileLayout showNavigation={false}>
                <CustomisationProvider>
                  <HelpDocumentation />
                </CustomisationProvider>
              </MobileLayout>
            </PageErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Help Button - Always visible */}
      <HelpButton />
    </div>
  )
}

export default App
