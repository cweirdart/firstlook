import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import OfflineBanner from './components/OfflineBanner'

// Eagerly loaded — first paint
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'

// Lazy loaded — split into separate chunks
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NewAlbum = lazy(() => import('./pages/NewAlbum'))
const AlbumView = lazy(() => import('./pages/AlbumView'))
const TableSignGenerator = lazy(() => import('./pages/TableSignGenerator'))
const Slideshow = lazy(() => import('./pages/Slideshow'))
const TVDisplay = lazy(() => import('./pages/TVDisplay'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Upload = lazy(() => import('./pages/Upload'))
const SharedAlbum = lazy(() => import('./pages/SharedAlbum'))
const Checkout = lazy(() => import('./pages/Checkout'))
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'))
const Admin = lazy(() => import('./pages/Admin'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const SetupGuide = lazy(() => import('./pages/SetupGuide'))
const ColorPalette = lazy(() => import('./pages/ColorPalette'))
const HowItWorks = lazy(() => import('./pages/HowItWorks'))
const WhatYouNeed = lazy(() => import('./pages/WhatYouNeed'))
const ForPlanners = lazy(() => import('./pages/ForPlanners'))
const ForWeddingParty = lazy(() => import('./pages/ForWeddingParty'))
const ForPhotographers = lazy(() => import('./pages/ForPhotographers'))
const ForDJs = lazy(() => import('./pages/ForDJs'))

// Minimal loading indicator matching the design system
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FBF9F6',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#9C8F87',
    gap: '16px',
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '2px solid #E8DFD5',
      borderTopColor: '#B8976A',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ fontSize: '1rem' }}>First Look</span>
  </div>
)

function App() {
  return (
    <>
    <OfflineBanner />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page (marketing) */}
        <Route path="/" element={<LandingPage />} />

        {/* Checkout flow */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<Admin />} />

        {/* Legal pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Free tools + SEO pages */}
        <Route path="/tools/colors" element={<ColorPalette />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/what-you-need" element={<WhatYouNeed />} />
        <Route path="/for-planners" element={<ForPlanners />} />
        <Route path="/for-wedding-party" element={<ForWeddingParty />} />
        <Route path="/for-photographers" element={<ForPhotographers />} />
        <Route path="/for-djs" element={<ForDJs />} />

        {/* Guest-facing routes (no app chrome) */}
        <Route path="/share/:shareCode" element={<SharedAlbum />} />
        <Route path="/upload/:shareCode" element={<Upload />} />

        {/* TV Display — fullscreen, no app chrome */}
        <Route path="/tv/:id" element={<TVDisplay />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App routes with layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/album/new" element={<NewAlbum />} />
          <Route path="/album/:id" element={<AlbumView />} />
          <Route path="/album/:id/signs" element={<TableSignGenerator />} />
          <Route path="/album/:id/slideshow" element={<Slideshow />} />
          <Route path="/album/:id/setup" element={<SetupGuide />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    </>
  )
}

export default App
