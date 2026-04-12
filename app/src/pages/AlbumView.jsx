import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import JSZip from 'jszip'
import * as storage from '../services/storage'
import { stripMetadata } from '../utils/exif'
import { generateId } from '../utils/id'

export default function AlbumView() {
  const { id: albumId } = useParams()
  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [lightboxPhoto, setLightboxPhoto] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [viewMode, setViewMode] = useState('all') // all, pending, favorites
  const [guestFilter, setGuestFilter] = useState('') // filter by guest name
  const fileInputRef = useRef(null)
  const dragZoneRef = useRef(null)

  const shareUrl = album ? `${window.location.origin}/share/${album.shareCode}` : ''
  const uploadUrl = album ? `${window.location.origin}/upload/${album.shareCode}` : ''

  // Show toast notification
  const showToast = (message, duration = 2500) => {
    setToast(message)
    setTimeout(() => setToast(null), duration)
  }

  // Load album and photos on mount
  useEffect(() => {
    async function loadAlbum() {
      try {
        const [albumData, photoList] = await Promise.all([
          storage.getAlbum(albumId),
          storage.getPhotosByAlbum(albumId),
        ])

        if (!albumData) {
          setError('Album not found')
          setIsLoading(false)
          return
        }

        setAlbum(albumData)
        setPhotos(photoList)
      } catch (err) {
        setError(err.message || 'Failed to load album')
      } finally {
        setIsLoading(false)
      }
    }

    loadAlbum()
  }, [albumId])

  // Generate thumbnail from file
  const generateThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxWidth = 300
        const maxHeight = 300

        let width = img.naturalWidth
        let height = img.naturalHeight

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        URL.revokeObjectURL(url)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to generate thumbnail'))
              return
            }
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Failed to read thumbnail'))
            reader.readAsDataURL(blob)
          },
          file.type || 'image/jpeg',
          0.8
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }

      img.src = url
    })
  }

  // Convert file to data URL
  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  // Download individual photo
  const downloadPhoto = async (photo) => {
    try {
      const link = document.createElement('a')
      link.href = photo.dataUrl
      link.download = photo.filename || `photo-${photo.id}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showToast('Photo downloaded')
    } catch (err) {
      console.error('Download failed:', err)
      setError('Failed to download photo')
    }
  }

  // Download all photos as zip
  const downloadAllAsZip = async () => {
    try {
      setIsUploading(true)
      const zip = new JSZip()

      photos.forEach((photo, i) => {
        const data = photo.dataUrl.split(',')[1]
        const ext = photo.filename?.split('.').pop() || 'jpg'
        zip.file(`${album.name}-${i + 1}.${ext}`, data, { base64: true })
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${album.name}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      showToast('All photos downloaded as ZIP')
    } catch (err) {
      console.error('ZIP download failed:', err)
      setError('Failed to download photos as ZIP')
    } finally {
      setIsUploading(false)
    }
  }

  // Delete photo with confirmation
  const deletePhoto = async (photoId) => {
    try {
      await storage.deletePhoto(photoId)
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))

      const updatedAlbum = {
        ...album,
        photoCount: Math.max(0, album.photoCount - 1),
      }
      setAlbum(updatedAlbum)
      await storage.saveAlbum(updatedAlbum)

      setDeleteConfirm(null)
      showToast('Photo deleted')
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete photo')
    }
  }

  // Set cover photo
  const setCoverPhoto = async (photoId) => {
    try {
      const photo = photos.find((p) => p.id === photoId)
      if (!photo) return

      const updatedAlbum = {
        ...album,
        coverPhotoUrl: photo.dataUrl,
      }
      setAlbum(updatedAlbum)
      await storage.saveAlbum(updatedAlbum)
      showToast('Cover photo updated')
    } catch (err) {
      console.error('Set cover failed:', err)
      setError('Failed to set cover photo')
    }
  }

  // Toggle moderation on album
  const toggleModeration = async () => {
    const updated = { ...album, moderationEnabled: !album.moderationEnabled }
    setAlbum(updated)
    await storage.saveAlbum(updated)
    showToast(updated.moderationEnabled ? 'Moderation enabled — new guest photos need approval' : 'Moderation disabled')
  }

  // Approve/reject photo
  const moderatePhoto = async (photoId, status) => {
    const photo = photos.find(p => p.id === photoId)
    if (!photo) return
    const updated = { ...photo, status }
    await storage.savePhoto(updated)
    setPhotos(prev => prev.map(p => p.id === photoId ? updated : p))
    showToast(status === 'approved' ? 'Photo approved' : 'Photo rejected')
  }

  // Approve all pending
  const approveAllPending = async () => {
    const pending = photos.filter(p => p.status === 'pending')
    for (const photo of pending) {
      const updated = { ...photo, status: 'approved' }
      await storage.savePhoto(updated)
    }
    setPhotos(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'approved' } : p))
    showToast(`${pending.length} photo${pending.length !== 1 ? 's' : ''} approved`)
  }

  // Toggle favorite
  const toggleFavorite = async (photoId) => {
    const photo = photos.find(p => p.id === photoId)
    if (!photo) return
    const updated = { ...photo, favorite: !photo.favorite }
    await storage.savePhoto(updated)
    setPhotos(prev => prev.map(p => p.id === photoId ? updated : p))
  }

  // Filtered photos based on view mode + guest filter
  const filteredPhotos = photos.filter(p => {
    if (viewMode === 'pending') return p.status === 'pending'
    if (viewMode === 'favorites') return p.favorite
    return true
  }).filter(p => {
    if (!guestFilter) return true
    return p.guestName === guestFilter
  })

  const pendingCount = photos.filter(p => p.status === 'pending').length
  const favoritesCount = photos.filter(p => p.favorite).length
  const uniqueGuests = [...new Set(photos.map(p => p.guestName).filter(Boolean))].sort()

  // Handle file upload with progress
  const handleFileUpload = useCallback(
    async (files) => {
      if (!album) return

      setIsUploading(true)
      setUploadProgress(0)
      setError(null)

      const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'))
      if (fileArray.length === 0) {
        setIsUploading(false)
        return
      }

      const uploadPromises = fileArray.map(async (file, index) => {
        try {
          const cleanedFile = await stripMetadata(file)
          const [dataUrl, thumbnailUrl] = await Promise.all([
            fileToDataUrl(cleanedFile),
            generateThumbnail(cleanedFile),
          ])

          const photo = {
            id: generateId(),
            albumId,
            filename: file.name,
            dataUrl,
            thumbnailUrl,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'owner',
            strippedMetadata: {},
          }

          await storage.savePhoto(photo)
          setUploadProgress(Math.round(((index + 1) / fileArray.length) * 100))
          return photo
        } catch (err) {
          console.error('Failed to upload photo:', err)
          return null
        }
      })

      try {
        const newPhotos = await Promise.all(uploadPromises)
        const validPhotos = newPhotos.filter(Boolean)

        if (validPhotos.length > 0) {
          setPhotos((prev) => [...validPhotos, ...prev])

          const updatedAlbum = {
            ...album,
            photoCount: album.photoCount + validPhotos.length,
          }
          setAlbum(updatedAlbum)
          await storage.saveAlbum(updatedAlbum)
          showToast(`Uploaded ${validPhotos.length} photo${validPhotos.length !== 1 ? 's' : ''}`)
        }

        if (validPhotos.length < fileArray.length) {
          setError(`${fileArray.length - validPhotos.length} file(s) failed to upload`)
        }
      } catch (err) {
        setError(err.message || 'Failed to upload photos')
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [album, albumId]
  )

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragZoneRef.current) {
      dragZoneRef.current.style.backgroundColor = 'var(--bg-blush)'
      dragZoneRef.current.style.borderColor = 'var(--accent)'
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragZoneRef.current) {
      dragZoneRef.current.style.backgroundColor = ''
      dragZoneRef.current.style.borderColor = ''
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (dragZoneRef.current) {
        dragZoneRef.current.style.backgroundColor = ''
        dragZoneRef.current.style.borderColor = ''
      }

      const { files } = e.dataTransfer
      if (files && files.length > 0) {
        handleFileUpload(files)
      }
    },
    [handleFileUpload]
  )

  // Lightbox navigation
  const currentPhotoIndex = lightboxPhoto ? photos.findIndex((p) => p.id === lightboxPhoto.id) : -1

  const goToNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setLightboxPhoto(photos[currentPhotoIndex + 1])
    }
  }

  const goToPrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setLightboxPhoto(photos[currentPhotoIndex - 1])
    }
  }

  // Keyboard handler for lightbox
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!lightboxPhoto) return

      if (e.key === 'Escape') {
        setLightboxPhoto(null)
      } else if (e.key === 'ArrowRight') {
        goToNextPhoto()
      } else if (e.key === 'ArrowLeft') {
        goToPrevPhoto()
      }
    }

    if (lightboxPhoto) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [lightboxPhoto, currentPhotoIndex])

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error && !album) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Error</h2>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      </div>
    )
  }

  const coverPhoto = album?.coverPhotoUrl
    ? photos.find((p) => p.dataUrl === album.coverPhotoUrl)
    : null

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            zIndex: 2000,
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {toast}
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(400px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      <div className="page">
        {/* Header Section */}
        <div
          style={{
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                fontWeight: '400',
                letterSpacing: '0.5px',
              }}
            >
              {album.name}
            </h1>
            {album.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontFamily: 'var(--font-body)' }}>
                {album.description}
              </p>
            )}
          </div>

          {/* Album Stats */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Photos
              </span>
              <span style={{ fontSize: '20px', color: 'var(--accent)', fontWeight: '500' }}>
                {photos.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Guests
              </span>
              <span style={{ fontSize: '20px', color: 'var(--accent)', fontWeight: '500' }}>
                {new Set(photos.map(p => p.guestName).filter(Boolean)).size || '—'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Created
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                {formatDate(album.createdAt)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Code
              </span>
              <span style={{ fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {album.shareCode}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color var(--transition)',
                opacity: isUploading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isUploading) e.currentTarget.style.backgroundColor = 'var(--accent-dark)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)'
              }}
            >
              Upload More
            </button>

            {photos.length > 0 && (
              <button
                onClick={downloadAllAsZip}
                disabled={isUploading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all var(--transition)',
                  opacity: isUploading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isUploading) e.currentTarget.style.backgroundColor = 'var(--border)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                }}
              >
                Download All
              </button>
            )}
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              borderRadius: 'var(--radius-md)',
              color: '#B91C1C',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
            }}
          >
            {error}
          </div>
        )}

        {/* Upload Zone (Subtle) */}
        <div
          ref={dragZoneRef}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            padding: '32px 24px',
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            marginBottom: '32px',
            backgroundColor: 'var(--bg-blush)',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📸</div>
          <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Drag photos here or click to browse'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
            All metadata is automatically removed for privacy
          </p>
          {isUploading && (
            <div
              style={{
                marginTop: '12px',
                height: '4px',
                backgroundColor: 'var(--border)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--accent)',
                  width: `${uploadProgress}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          )}
        </div>

        {/* QR Code & Share Section */}
        <div
          style={{
            marginBottom: '32px',
            padding: '28px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3
            style={{
              marginBottom: '20px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: '400',
            }}
          >
            Share With Guests
          </h3>

          <div className="share-grid">
            {/* Guest View Section */}
            <div>
              <h4
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Guest View & Upload
              </h4>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '12px',
                }}
              >
                <QRCodeSVG
                  value={shareUrl}
                  size={140}
                  level="H"
                  includeMargin={true}
                  bgColor="#FBF9F6"
                  fgColor="#3D3530"
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
                Scan to view & upload photos
              </p>
            </div>

            {/* Share URL Section */}
            <div>
              <h4
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Share Link
              </h4>
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      showToast('Link copied!')
                    }}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'var(--accent-rose)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'background-color var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B8756E'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-rose)'
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload-only URL Section */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h4
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
                fontFamily: 'var(--font-body)',
              }}
            >
              Upload Only (No Viewing)
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
              Share this link with guests who should only upload photos, not view others:
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={uploadUrl}
                readOnly
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(uploadUrl)
                  showToast('Upload link copied!')
                }}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--accent-rose)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'background-color var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8756E'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-rose)'
                }}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={`/album/${albumId}/signs`}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Table Signs
            </Link>
            <Link
              to={`/album/${albumId}/slideshow`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                backgroundColor: 'var(--bg-primary)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Reception Slideshow
            </Link>
            <Link
              to={`/tv/${albumId}`}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                backgroundColor: 'var(--bg-primary)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              Display on TV
            </Link>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '12px',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            <strong>TV Setup:</strong> Open the "Display on TV" link on your Smart TV's browser, Fire Stick, or cast from your phone. Photos appear in real time as guests upload.
          </p>
        </div>

        {/* Cover Photo Section */}
        {coverPhoto && (
          <div
            style={{
              marginBottom: '32px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(61, 53, 48, 0.1)',
            }}
          >
            <div
              style={{
                position: 'relative',
                paddingBottom: '66.67%',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <img
                src={coverPhoto.dataUrl}
                alt="Cover photo"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Album Cover
              </div>
            </div>
          </div>
        )}

        {/* Moderation Toggle + Filter Tabs */}
        {photos.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
              {[
                { key: 'all', label: `All (${photos.length})` },
                ...(pendingCount > 0 ? [{ key: 'pending', label: `Pending (${pendingCount})` }] : []),
                ...(favoritesCount > 0 ? [{ key: 'favorites', label: `Favorites (${favoritesCount})` }] : []),
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setViewMode(tab.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'calc(var(--radius-md) - 2px)',
                    border: 'none',
                    background: viewMode === tab.key ? 'var(--bg-primary)' : 'transparent',
                    color: viewMode === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: viewMode === tab.key ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: viewMode === tab.key ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Guest Filter + Moderation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {uniqueGuests.length > 1 && (
                <select
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">All guests</option>
                  {uniqueGuests.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {viewMode === 'pending' && pendingCount > 0 && (
                <button
                  onClick={approveAllPending}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--accent)',
                    background: 'transparent',
                    color: 'var(--accent-dark)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Approve All
                </button>
              )}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}>
                <div
                  onClick={toggleModeration}
                  style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    backgroundColor: album?.moderationEnabled ? 'var(--accent)' : 'var(--border)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: album?.moderationEnabled ? '18px' : '2px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }} />
                </div>
                Moderation
              </label>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x1F5BC;&#xFE0F;</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
              No photos yet
            </h3>
            <p style={{ fontFamily: 'var(--font-body)' }}>
              Drag and drop photos above or click to upload your first image
            </p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              {viewMode === 'pending' ? 'No photos waiting for approval' : 'No favorite photos yet — click the heart on any photo'}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="photo-grid-item"
                onClick={() => setLightboxPhoto(photo)}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'transform var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {/* Photo Image */}
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt="thumbnail"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: photo.status === 'rejected' ? 0.4 : 1,
                    }}
                  />
                </div>

                {/* Favorite Button — always visible */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id) }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: photo.favorite ? 'var(--accent-rose)' : 'rgba(255,255,255,0.8)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    transition: 'all 0.15s ease',
                    pointerEvents: 'auto',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill={photo.favorite ? 'white' : 'none'} stroke={photo.favorite ? 'white' : 'var(--accent-rose)'} strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                {/* Moderation Status Badge */}
                {photo.status === 'pending' && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 5,
                    pointerEvents: 'auto',
                  }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); moderatePhoto(photo.id, 'approved') }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(34, 197, 94, 0.9)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      }}
                      title="Approve"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}><polyline points="20 6 9 17 4 12" /></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moderatePhoto(photo.id, 'rejected') }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      }}
                      title="Reject"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                )}
                {photo.status === 'rejected' && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(239, 68, 68, 0.85)',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    fontWeight: 600,
                    zIndex: 5,
                    pointerEvents: 'auto',
                  }}>
                    Rejected
                  </div>
                )}

                {/* Hover Overlay with Actions */}
                <div
                  className="photo-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    opacity: 0,
                    transition: 'opacity var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Counter */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      marginBottom: '8px',
                    }}
                  >
                    {index + 1} of {photos.length}
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadPhoto(photo)
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'background-color var(--transition)',
                      pointerEvents: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-dark)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent)'
                    }}
                  >
                    Download
                  </button>

                  {/* Set Cover Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setCoverPhoto(photo.id)
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'var(--accent-rose)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'background-color var(--transition)',
                      pointerEvents: 'auto',
                      opacity: album?.coverPhotoUrl === photo.dataUrl ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (album?.coverPhotoUrl !== photo.dataUrl) {
                        e.currentTarget.style.backgroundColor = '#B8756E'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-rose)'
                    }}
                  >
                    {album?.coverPhotoUrl === photo.dataUrl ? 'Cover' : 'Set Cover'}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirm(photo.id)
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#DC2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'background-color var(--transition)',
                      pointerEvents: 'auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B91C1C'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>{`
          .photo-grid-item:hover .photo-overlay {
            opacity: 1 !important;
          }
          .share-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-bottom: 24px;
          }
          @media (max-width: 768px) {
            .share-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
          }
        `}</style>

        {/* Guest Book Messages */}
        <GuestBook albumId={albumId} />

        {/* Video Messages */}
        <VideoMessages albumId={albumId} />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          disabled={isUploading}
          style={{ display: 'none' }}
        />
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '90vw',
              maxHeight: '90vh',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxPhoto(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              ✕
            </button>

            {/* Photo */}
            <img
              src={lightboxPhoto.dataUrl}
              alt="full size"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
              }}
            />

            {/* Photo Counter */}
            <div
              style={{
                position: 'absolute',
                bottom: '-40px',
                left: '0',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
              }}
            >
              {currentPhotoIndex + 1} of {photos.length}
            </div>

            {/* Navigation Arrows */}
            {currentPhotoIndex > 0 && (
              <button
                onClick={goToPrevPhoto}
                style={{
                  position: 'absolute',
                  left: '-50px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '32px',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'opacity var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                ←
              </button>
            )}

            {currentPhotoIndex < photos.length - 1 && (
              <button
                onClick={goToNextPhoto}
                style={{
                  position: 'absolute',
                  right: '-50px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '32px',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'opacity var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                →
              </button>
            )}

            {/* Download Button in Lightbox */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                downloadPhoto(lightboxPhoto)
              }}
              style={{
                position: 'absolute',
                bottom: '-40px',
                right: '0',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'opacity var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              ⬇ Download
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          onClick={() => setDeleteConfirm(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                color: 'var(--text-primary)',
                marginBottom: '12px',
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
              }}
            >
              Delete Photo?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontFamily: 'var(--font-body)' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--border)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deletePhoto(deleteConfirm)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Guest Book Component ───────────────────────────────

function GuestBook({ albumId }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const msgs = await storage.getMessagesByAlbum(albumId)
        setMessages(msgs)
      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [albumId])

  const handleDelete = async (msgId) => {
    await storage.deleteMessage(msgId)
    setMessages(prev => prev.filter(m => m.id !== msgId))
  }

  if (loading || messages.length === 0) return null

  const visibleMessages = expanded ? messages : messages.slice(0, 3)

  return (
    <div style={{
      marginTop: '32px',
      marginBottom: '32px',
      padding: '28px',
      backgroundColor: 'var(--bg-blush)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        fontWeight: 400,
        color: 'var(--text-primary)',
        marginBottom: '20px',
      }}>
        Guest Book
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          fontWeight: 400,
          marginLeft: '12px',
        }}>
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {visibleMessages.map(msg => (
          <div
            key={msg.id}
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              position: 'relative',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              marginBottom: '8px',
              fontStyle: 'italic',
            }}>
              "{msg.text}"
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                margin: 0,
              }}>
                — {msg.guestName} · {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <button
                onClick={() => handleDelete(msg.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'var(--font-body)',
                  opacity: 0.5,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {messages.length > 3 && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          style={{
            display: 'block',
            margin: '16px auto 0',
            background: 'none',
            border: 'none',
            color: 'var(--accent-dark)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {expanded ? 'Show less' : `Show all ${messages.length} messages`}
        </button>
      )}
    </div>
  )
}


// ── Video Messages Component ──────────────────────────────

function VideoMessages({ albumId }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const vids = await storage.getVideoMessagesByAlbum(albumId)
        setVideos(vids)
      } catch (err) {
        console.error('Failed to load video messages:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [albumId])

  const handleDelete = async (video) => {
    await storage.deleteVideoMessage(video.id, video.storagePath)
    setVideos(prev => prev.filter(v => v.id !== video.id))
  }

  const formatSize = (bytes) => {
    if (!bytes) return ''
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`
  }

  if (loading || videos.length === 0) return null

  const visibleVideos = expanded ? videos : videos.slice(0, 3)

  return (
    <div style={{
      marginTop: '32px',
      marginBottom: '32px',
      padding: '28px',
      backgroundColor: 'var(--bg-blush)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        fontWeight: 400,
        color: 'var(--text-primary)',
        marginBottom: '20px',
      }}>
        Video Messages
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          fontWeight: 400,
          marginLeft: '12px',
        }}>
          {videos.length} video{videos.length !== 1 ? 's' : ''}
        </span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {visibleVideos.map(video => (
          <div
            key={video.id}
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              position: 'relative',
            }}
          >
            <video
              src={video.videoUrl}
              controls
              preload="metadata"
              playsInline
              style={{
                width: '100%',
                maxHeight: '360px',
                borderRadius: '8px',
                backgroundColor: '#1a1a1a',
                marginBottom: '10px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                margin: 0,
              }}>
                {video.guestName} · {new Date(video.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {video.fileSize ? ` · ${formatSize(video.fileSize)}` : ''}
              </p>
              <button
                onClick={() => handleDelete(video)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'var(--font-body)',
                  opacity: 0.5,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {videos.length > 3 && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          style={{
            display: 'block',
            margin: '16px auto 0',
            background: 'none',
            border: 'none',
            color: 'var(--accent-dark)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {expanded ? 'Show less' : `Show all ${videos.length} videos`}
        </button>
      )}
    </div>
  )
}
