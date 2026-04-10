import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'

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

// Minimal loading indicator matching the design system
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FBF9F6',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '1.2rem',
    color: '#9C8F87',
  }}>
    Loading...
  </div>
)

function App() {
  return (
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
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
