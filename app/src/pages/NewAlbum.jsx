import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../context/AppContext'
import * as storage from '../services/storage'
import { generateId, generateShareCode } from '../utils/id'
import { hashPassword } from '../utils/crypto'
import { COUPLE_TYPE_OPTIONS, CUSTOM_LABEL_FIELDS } from '../utils/coupleType'
import { trackEvent } from '../utils/analytics'

export default function NewAlbum() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    password: '',
    protectWithPassword: false,
    coupleType: 'bride-groom',
    weddingDate: '',
    customLabels: {
      partner1: '',
      partner2: '',
      bestPerson1: '',
      bestPerson2: '',
      attendants1: '',
      attendants2: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e) => {
    const { checked } = e.target
    setFormData((prev) => ({
      ...prev,
      protectWithPassword: checked,
      password: checked ? prev.password : '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Album name is required')
      return
    }

    if (formData.protectWithPassword && !formData.password.trim()) {
      setError('Password is required when protection is enabled')
      return
    }

    setIsSubmitting(true)

    try {
      const albumId = generateId()
      const shareCode = generateShareCode()

      let passwordHash = null
      if (formData.protectWithPassword && formData.password) {
        passwordHash = await hashPassword(formData.password)
      }

      // Only persist customLabels when coupleType is 'custom', and trim blank fields
      let customLabels = null
      if (formData.coupleType === 'custom') {
        customLabels = {}
        for (const [key, value] of Object.entries(formData.customLabels)) {
          const trimmed = (value || '').trim()
          if (trimmed) customLabels[key] = trimmed
        }
        if (Object.keys(customLabels).length === 0) customLabels = null
      }

      const album = {
        id: albumId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        shareCode,
        passwordHash,
        coupleType: formData.coupleType,
        customLabels,
        weddingDate: formData.weddingDate || null,
        photoCount: 0,
        createdAt: new Date().toISOString(),
        coverPhotoUrl: null,
      }

      await storage.saveAlbum(album)

      trackEvent('Album Created', { coupleType: formData.coupleType, hasDate: !!formData.weddingDate })

      dispatch({
        type: 'ADD_ALBUM',
        album,
      })

      navigate(`/album/${albumId}`)
    } catch (err) {
      setError(err.message || 'Failed to create album')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create Album</h1>
        <p className="page-subtitle">Start a new wedding album to organize and share photos</p>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px 16px',
                backgroundColor: 'rgba(180, 74, 74, 0.08)',
                border: '1px solid rgba(180, 74, 74, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: '#B44A4A',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name" className="label">
              Album Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="input"
              placeholder="e.g., Wedding Day, Reception Photos"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="input"
              placeholder="Add a description or notes about this album..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows="4"
              style={{
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="label" style={{ marginBottom: '8px', display: 'block' }}>
              Couple Type
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {COUPLE_TYPE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, coupleType: option.value }))}
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.coupleType === option.value
                      ? '2px solid var(--accent)'
                      : '1px solid var(--border)',
                    background: formData.coupleType === option.value
                      ? 'rgba(184, 151, 106, 0.08)'
                      : 'var(--bg-card)',
                    color: formData.coupleType === option.value
                      ? 'var(--accent-dark)'
                      : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: formData.coupleType === option.value ? '600' : '400',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              This customizes language throughout your album (e.g., "best man" vs "best woman")
            </p>

            {formData.coupleType === 'custom' && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 12px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  Enter the terms your wedding party uses. Leave any field blank to use a neutral default.
                </p>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {CUSTOM_LABEL_FIELDS.map(field => (
                    <div key={field.key}>
                      <label
                        htmlFor={`custom-${field.key}`}
                        className="label"
                        style={{ fontSize: '12px', marginBottom: '4px', display: 'block' }}
                      >
                        {field.label}
                      </label>
                      <input
                        id={`custom-${field.key}`}
                        type="text"
                        className="input"
                        placeholder={field.placeholder}
                        value={formData.customLabels[field.key]}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            customLabels: { ...prev.customLabels, [field.key]: e.target.value },
                          }))
                        }
                        disabled={isSubmitting}
                        maxLength={60}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="weddingDate" className="label">
              Wedding Date
            </label>
            <input
              id="weddingDate"
              type="date"
              name="weddingDate"
              className="input"
              value={formData.weddingDate}
              onChange={handleInputChange}
              disabled={isSubmitting}
              style={{ maxWidth: '220px' }}
            />
            <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Optional — helps us send you a setup reminder before your big day
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                name="protectWithPassword"
                checked={formData.protectWithPassword}
                onChange={handleCheckboxChange}
                disabled={isSubmitting}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: 'var(--accent)',
                }}
              />
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>
                Protect with password
              </span>
            </label>
          </div>

          {formData.protectWithPassword && (
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="password" className="label">
                Password *
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="input"
                placeholder="Enter a password to protect this album"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required={formData.protectWithPassword}
              />
              <p
                style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                Password is stored securely and required to view shared albums
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%' }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px' }} />
                Creating...
              </>
            ) : (
              'Create Album'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
