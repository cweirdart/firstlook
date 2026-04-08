import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import NewAlbum from './pages/NewAlbum'
import AlbumView from './pages/AlbumView'
import TableSignGenerator from './pages/TableSignGenerator'
import Slideshow from './pages/Slideshow'
import TVDisplay from './pages/TVDisplay'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Upload from './pages/Upload'
import SharedAlbum from './pages/SharedAlbum'

function App() {
  return (
    <Routes>
      {/* Landing page (marketing) */}
      <Route path="/" element={<LandingPage />} />

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
    </Routes>
  )
}

export default App
