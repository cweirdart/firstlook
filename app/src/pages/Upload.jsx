import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as storage from '../services/storage'
import { stripMetadata, readMetadata } from '../utils/exif'
import { generateId } from '../utils/id'
import { hashPassword } from '../utils/crypto'

async function findAlbumByShareCode(code) {
  const albums = await storage.getAlbums()
  return albums.find(a => a.shareCode === code) || null
}

function createThumbnail(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 400
      let w = img.naturalWidth,
        h = img.naturalHeight
      if (w > h) {
        h = h * (MAX / w)
        w = MAX
      } else {
        w = w * (MAX / h)
        h = MAX
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = url
  })
}

function readAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

export default function Upload() {
  const { shareCode } = useParams()
  const navigate = useNavigate()

  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [verifyingPassword, setVerifyingPassword] = useState(false)

  const [uploadState, setUploadState] = useState('idle') // idle, uploading, success, error
  const [files, setFiles] = useState([])
  const [thumbnails, setThumbnails] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [strippedMetadata, setStrippedMetadata] = useState([])
  const [guestName, setGuestName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const dragRef = useRef(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const currentUploadIndex = useRef(0)

  // Load album on mount
  useEffect(() => {
    const loadAlbum = async () => {
      setLoading(true)
      setError(null)

      if (!shareCode) {
        setError('Invalid album link')
        setLoading(false)
        return
      }

      try {
        const foundAlbum = await findAlbumByShareCode(shareCode)
        if (!foundAlbum) {
          setError('Album not found')
          setLoading(false)
          return
        }

        if (foundAlbum.passwordHash) {
          setPasswordRequired(true)
          setAlbum(foundAlbum)
        } else {
          setAlbum(foundAlbum)
        }
      } catch (err) {
        setError('Failed to load album')
      } finally {
        setLoading(false)
      }
    }

    loadAlbum()
  }, [shareCode])

  // Verify password
  const handleVerifyPassword = async (e) => {
    e.preventDefault()
    setVerifyingPassword(true)
    setPasswordError(null)

    try {
      const hash = await hashPassword(passwordInput)
      if (hash === album.passwordHash) {
        setPasswordRequired(false)
        setPasswordInput('')
      } else {
        setPasswordError('Incorrect password')
      }
    } catch (err) {
      setPasswordError('Error verifying password')
    } finally {
      setVerifyingPassword(false)
    }
  }

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current?.style && (dragRef.current.style.borderColor = 'var(--accent)')
    dragRef.current?.style && (dragRef.current.style.background = 'rgba(124, 139, 111, 0.06)')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current?.style && (dragRef.current.style.borderColor = 'var(--border)')
    dragRef.current?.style && (dragRef.current.style.background = 'var(--bg-secondary)')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current?.style && (dragRef.current.style.borderColor = 'var(--border)')
    dragRef.current?.style && (dragRef.current.style.background = 'transparent')

    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles])
    }
  }

  // Generate thumbnail preview for a file
  const generateThumbnailPreview = useCallback(async (file) => {
    const url = URL.createObjectURL(file)
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve(url)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      img.src = url
    })
  }, [])

  // Handle file selection
  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/')
    )
    if (selectedFiles.length > 0) {
      const newThumbnails = []
      for (const file of selectedFiles) {
        const thumb = await generateThumbnailPreview(file)
        newThumbnails.push(thumb)
      }
      setFiles((prev) => [...prev, ...selectedFiles])
      setThumbnails((prev) => [...prev, ...newThumbnails])
    }
  }

  // Handle camera photo capture
  const handleCameraCapture = async (e) => {
    const capturedFiles = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/')
    )
    if (capturedFiles.length > 0) {
      const newThumbnails = []
      for (const file of capturedFiles) {
        const thumb = await generateThumbnailPreview(file)
        newThumbnails.push(thumb)
      }
      setFiles((prev) => [...prev, ...capturedFiles])
      setThumbnails((prev) => [...prev, ...newThumbnails])
    }
  }

  // Remove file by index
  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
    setThumbnails((prev) => prev.filter((_, i) => i !== idx))
  }

  // Process and upload files
  const handleUpload = useCallback(async () => {
    if (!files.length || !album) return

    setUploadState('uploading')
    setUploadProgress(0)
    setStrippedMetadata([])
    setUploadedPhotos([])
    const metadata = []
    const uploaded = []
    currentUploadIndex.current = 0

    try {
      for (let i = 0; i < files.length; i++) {
        currentUploadIndex.current = i
        const file = files[i]

        // Read metadata before stripping
        const fileMeta = await readMetadata(file)
        metadata.push({
          filename: file.name,
          gpsRemoved: !!(fileMeta.tags.GPSLatitude || fileMeta.tags.GPSLongitude),
          cameraRemoved: !!(fileMeta.tags.Make || fileMeta.tags.Model),
          dateRemoved: !!(fileMeta.tags.DateTimeOriginal || fileMeta.tags.DateTime),
        })

        // Strip metadata
        const cleanFile = await stripMetadata(file)

        // Create thumbnail
        const thumbnailUrl = await createThumbnail(cleanFile)

        // Read as dataUrl
        const dataUrl = await readAsDataUrl(cleanFile)

        // Create photo object
        const photo = {
          id: generateId(),
          albumId: album.id,
          filename: file.name,
          dataUrl,
          thumbnailUrl,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'guest',
          status: album.moderationEnabled ? 'pending' : 'approved',
          strippedMetadata: metadata[i],
        }

        // Save to storage
        await storage.savePhoto(photo)
        uploaded.push(thumbnailUrl)

        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      // Save guest book message if provided
      if (guestMessage.trim()) {
        const message = {
          id: generateId(),
          albumId: album.id,
          guestName: guestName.trim() || 'A Guest',
          text: guestMessage.trim(),
          createdAt: new Date().toISOString(),
        }
        await storage.saveMessage(message)
      }

      setStrippedMetadata(metadata)
      setUploadedPhotos(uploaded)
      setUploadState('success')
    } catch (err) {
      console.error('Upload error:', err)
      setUploadState('error')
    }
  }, [files, album])

  // Loading state
  if (loading) {
    return (
      <div className="page" style={{ minHeight: '100vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: '16px',
          }}
        >
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading album...</p>
        </div>
      </div>
    )
  }

  // Error state - album not found
  if (error) {
    return (
      <div className="page" style={{ minHeight: '100vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <svg
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                opacity: 0.3,
                color: 'var(--text-muted)',
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {error}
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '14px',
                marginBottom: '24px',
              }}
            >
              The album link may have expired or is invalid. Please check and try again.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  // Password prompt state
  if (passwordRequired) {
    return (
      <div className="page" style={{ minHeight: '100vh' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 24px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              {album.name}
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              This album is password protected
            </p>

            <form onSubmit={handleVerifyPassword}>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setPasswordError(null)
                  }}
                  placeholder="Enter password"
                  disabled={verifyingPassword}
                  autoFocus
                />
                {passwordError && (
                  <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>
                    {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={verifyingPassword || !passwordInput.trim()}
              >
                {verifyingPassword ? 'Verifying...' : 'Unlock'}
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  // Success state
  if (uploadState === 'success') {
    return (
      <div className="page" style={{ minHeight: '100vh', paddingBottom: '100px' }}>
        {/* Success Header */}
        <div
          style={{
            paddingTop: '60px',
            paddingBottom: '40px',
            textAlign: 'center',
          }}
        >
          {/* Checkmark Animation */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--bg-blush)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <svg
              style={{
                width: '40px',
                height: '40px',
                color: 'var(--accent)',
                animation: 'fadeIn 0.8s ease-in-out 0.2s both',
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              marginBottom: '8px',
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
            }}
          >
            What a moment!
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              marginBottom: '32px',
              animation: 'fadeInUp 0.6s ease-out 0.4s both',
            }}
          >
            {files.length} beautiful moment{files.length !== 1 ? 's' : ''} added to the album
          </p>
        </div>

        {/* Photo Grid */}
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
          {uploadedPhotos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: '40px',
              }}
            >
              {uploadedPhotos.map((thumb, idx) => (
                <div
                  key={idx}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    animation: `fadeInScale 0.5s ease-out ${idx * 0.08}s both`,
                  }}
                >
                  <img
                    src={thumb}
                    alt={`Uploaded ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Privacy Note */}
          <div
            style={{
              background: 'var(--bg-blush)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.6',
              }}
            >
              Your photos have been secured. Location data and personal information have been removed.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => {
                setUploadState('idle')
                setFiles([])
                setThumbnails([])
                setUploadedPhotos([])
                setStrippedMetadata([])
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                minHeight: '44px',
              }}
            >
              Upload More Photos
            </button>
          </div>
        </div>

        <style>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>

        <Footer />
      </div>
    )
  }

  // Idle/uploading state
  return (
    <div className="page" style={{ minHeight: '100vh', paddingBottom: '120px', background: 'var(--bg-primary)' }}>
      {/* Elegant Header with Album Name */}
      <div
        style={{
          paddingTop: '32px',
          paddingBottom: '24px',
          paddingLeft: '20px',
          paddingRight: '20px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
          }}
        >
          {album.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
          Share your favorite moments
        </p>
      </div>

      {/* Main Upload Area */}
      <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        {/* Upload Zone - Large and Prominent */}
        <div
          ref={dragRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            minHeight: 'max(50vh, 280px)',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-blush) 100%)',
            border: '2px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--bg-blush) 0%, rgba(250, 240, 235, 0.8) 100%)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-blush) 100%)'
          }}
        >
          {uploadState !== 'uploading' && (
            <>
              {/* Camera Icon - Large */}
              <svg
                style={{
                  width: '64px',
                  height: '64px',
                  color: 'var(--accent)',
                  marginBottom: '20px',
                  opacity: 0.8,
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>

              {/* Text */}
              <p
                style={{
                  fontSize: '18px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                Tap to add photos
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                or drag and drop
              </p>
            </>
          )}

          {uploadState === 'uploading' && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--accent)',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '20px',
                }}
              />
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  margin: '0 0 8px 0',
                }}
              >
                Processing {currentUploadIndex.current + 1} of {files.length}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                Securing your photos...
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Camera vs Library Buttons */}
        {uploadState === 'idle' && files.length === 0 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => cameraInputRef.current?.click()}
              style={{
                flex: 1,
                minHeight: '44px',
                border: '1px solid var(--border)',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
            >
              Take Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                minHeight: '44px',
                border: '1px solid var(--border)',
                background: 'white',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
            >
              Choose Photos
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Thumbnail Previews - Horizontal Scroll */}
        {files.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '12px',
                marginBottom: '12px',
              }}
            >
              {thumbnails.map((thumb, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-secondary)',
                    border: '2px solid var(--border)',
                    animation: 'slideInLeft 0.3s ease-out',
                  }}
                >
                  {thumb && (
                    <img
                      src={thumb}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(idx)}
                    disabled={uploadState === 'uploading'}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#EF4444',
                      border: '2px solid white',
                      color: 'white',
                      cursor: uploadState === 'uploading' ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transition: 'all 0.2s ease',
                      opacity: uploadState === 'uploading' ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (uploadState !== 'uploading') {
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    <svg
                      style={{ width: '16px', height: '16px' }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Photo Count and Progress */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: '4px',
                paddingRight: '4px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {files.length} photo{files.length !== 1 ? 's' : ''} selected
              </p>
              {uploadState === 'idle' && (
                <button
                  onClick={() => {
                    setFiles([])
                    setThumbnails([])
                  }}
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploadState === 'uploading' && (
          <div
            style={{
              marginBottom: '24px',
              padding: '16px',
              background: 'var(--bg-blush)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(184, 151, 106, 0.15)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'var(--accent)',
                  width: `${uploadProgress}%`,
                  transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </div>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              {uploadProgress}%
            </p>
          </div>
        )}

        {/* Guest Book Message — Optional */}
        {files.length > 0 && uploadState === 'idle' && (
          <div style={{
            marginBottom: '20px',
            padding: '20px',
            background: 'var(--bg-blush)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              color: 'var(--text-primary)',
              marginBottom: '12px',
              fontWeight: 400,
            }}>
              Leave a message for the couple
            </p>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name (optional)"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                marginBottom: '8px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
              }}
            />
            <textarea
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              placeholder="Congratulations! Wishing you both a lifetime of happiness..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box',
                resize: 'vertical',
                lineHeight: '1.5',
              }}
            />
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '6px',
            }}>
              Optional — the couple will see your message in their guest book
            </p>
          </div>
        )}

        {/* Upload Button */}
        {uploadState !== 'uploading' && (
          <button
            onClick={handleUpload}
            disabled={uploadState === 'uploading' || files.length === 0}
            className="btn btn-primary"
            style={{
              width: '100%',
              minHeight: '48px',
              marginBottom: '12px',
              fontSize: '15px',
              fontWeight: 500,
              opacity: files.length === 0 ? 0.5 : 1,
              cursor: files.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Upload {files.length > 0 ? files.length : ''}
            {files.length === 1 ? ' Photo' : files.length > 1 ? ' Photos' : ''}
          </button>
        )}

        {/* Error State */}
        {uploadState === 'error' && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '16px',
              animation: 'slideInDown 0.3s ease-out',
            }}
          >
            <p style={{ fontSize: '13px', color: '#DC2626', margin: 0 }}>
              An error occurred while uploading. Please try again.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '16px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(253, 251, 247, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        First Look
      </p>
    </div>
  )
}
