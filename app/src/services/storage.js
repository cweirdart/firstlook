/**
 * Storage service — unified interface for data persistence.
 *
 * When Supabase is configured (env vars set), uses Supabase Postgres + Storage.
 * Otherwise falls back to localForage (IndexedDB) for local development.
 *
 * All functions maintain the same API regardless of backend.
 */
import localforage from 'localforage'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ── Local Storage Instances (fallback) ─────────────────────

const albumStore = localforage.createInstance({ name: 'wedding-app', storeName: 'albums' })
const photoStore = localforage.createInstance({ name: 'wedding-app', storeName: 'photos' })
const messageStore = localforage.createInstance({ name: 'wedding-app', storeName: 'messages' })
const settingsStore = localforage.createInstance({ name: 'wedding-app', storeName: 'settings' })


// ── Albums ──────────────────────────────────────────────────

export async function getAlbums(ownerId) {
  if (isSupabaseConfigured()) {
    const query = ownerId
      ? supabase.from('albums').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false })
      : supabase.from('albums').select('*').order('created_at', { ascending: false })
    const { data, error } = await query
    if (error) throw error
    return (data || []).map(mapAlbumFromDB)
  }

  // Local fallback
  const albums = []
  await albumStore.iterate((value) => { albums.push(value) })
  return albums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function getAlbum(id) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('albums').select('*').eq('id', id).single()
    if (error) {
      if (error.code === 'PGRST116') return null // not found
      throw error
    }
    return mapAlbumFromDB(data)
  }
  return albumStore.getItem(id)
}

export async function getAlbumByShareCode(shareCode) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('albums').select('*').eq('share_code', shareCode).single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return mapAlbumFromDB(data)
  }
  // Local fallback — iterate to find by share code
  const albums = await getAlbums()
  return albums.find(a => a.shareCode === shareCode) || null
}

export async function saveAlbum(album) {
  if (isSupabaseConfigured()) {
    const dbAlbum = mapAlbumToDB(album)
    const { data, error } = await supabase
      .from('albums')
      .upsert(dbAlbum, { onConflict: 'id' })
      .select()
      .single()
    if (error) throw error
    return mapAlbumFromDB(data)
  }
  await albumStore.setItem(album.id, album)
  return album
}

export async function deleteAlbum(id) {
  if (isSupabaseConfigured()) {
    // Delete photos from storage bucket first
    const photos = await getPhotosByAlbum(id)
    for (const photo of photos) {
      if (photo.storagePath) {
        await supabase.storage.from('photos').remove([photo.storagePath])
      }
      if (photo.thumbnailPath) {
        await supabase.storage.from('thumbnails').remove([photo.thumbnailPath])
      }
    }
    const { error } = await supabase.from('albums').delete().eq('id', id)
    if (error) throw error
    return
  }
  // Local fallback
  const photos = await getPhotosByAlbum(id)
  for (const photo of photos) {
    await deletePhoto(photo.id)
  }
  await albumStore.removeItem(id)
}


// ── Photos ──────────────────────────────────────────────────

export async function getPhotosByAlbum(albumId) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('uploaded_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapPhotoFromDB)
  }
  const photos = []
  await photoStore.iterate((value) => {
    if (value.albumId === albumId) photos.push(value)
  })
  return photos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
}

export async function getPhoto(id) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('photos').select('*').eq('id', id).single()
    if (error) return null
    return mapPhotoFromDB(data)
  }
  return photoStore.getItem(id)
}

export async function savePhoto(photo) {
  if (isSupabaseConfigured()) {
    const dbPhoto = mapPhotoToDB(photo)
    const { data, error } = await supabase
      .from('photos')
      .upsert(dbPhoto, { onConflict: 'id' })
      .select()
      .single()
    if (error) throw error
    return mapPhotoFromDB(data)
  }
  await photoStore.setItem(photo.id, photo)
  return photo
}

export async function deletePhoto(id) {
  if (isSupabaseConfigured()) {
    // Get photo to find storage paths
    const photo = await getPhoto(id)
    if (photo?.storagePath) {
      await supabase.storage.from('photos').remove([photo.storagePath])
    }
    if (photo?.thumbnailPath) {
      await supabase.storage.from('thumbnails').remove([photo.thumbnailPath])
    }
    const { error } = await supabase.from('photos').delete().eq('id', id)
    if (error) throw error
    return
  }
  await photoStore.removeItem(id)
}

export async function getPhotoCount(albumId) {
  if (isSupabaseConfigured()) {
    const { count, error } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('album_id', albumId)
    if (error) throw error
    return count || 0
  }
  let count = 0
  await photoStore.iterate((value) => {
    if (value.albumId === albumId) count++
  })
  return count
}

/**
 * Upload a photo file to Supabase Storage and create the DB record.
 * Returns the saved photo object.
 */
export async function uploadPhoto({ albumId, file, thumbnailBlob, filename, uploadedBy, status, guestName }) {
  if (!isSupabaseConfigured()) {
    throw new Error('uploadPhoto requires Supabase. Use savePhoto for local storage.')
  }

  const photoId = crypto.randomUUID()
  const ext = filename?.split('.').pop() || 'jpg'
  const storagePath = `${albumId}/${photoId}.${ext}`
  const thumbPath = `${albumId}/${photoId}_thumb.jpg`

  // Upload full photo
  const { error: uploadErr } = await supabase.storage
    .from('photos')
    .upload(storagePath, file, { contentType: file.type || 'image/jpeg' })
  if (uploadErr) throw uploadErr

  // Upload thumbnail
  if (thumbnailBlob) {
    await supabase.storage
      .from('thumbnails')
      .upload(thumbPath, thumbnailBlob, { contentType: 'image/jpeg' })
  }

  // Create DB record
  const { data, error } = await supabase
    .from('photos')
    .insert({
      id: photoId,
      album_id: albumId,
      uploaded_by: uploadedBy || 'guest',
      filename,
      storage_path: storagePath,
      thumbnail_path: thumbPath,
      status: status || 'approved',
      guest_name: guestName || null,
    })
    .select()
    .single()

  if (error) throw error
  return mapPhotoFromDB(data)
}

/**
 * Get public URL for a photo from Supabase Storage.
 */
export function getPhotoUrl(storagePath, bucket = 'photos') {
  if (!isSupabaseConfigured() || !storagePath) return null
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)
  return data?.publicUrl || null
}


// ── Guest Book Messages ─────────────────────────────────────

export async function getMessagesByAlbum(albumId) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapMessageFromDB)
  }
  const messages = []
  await messageStore.iterate((value) => {
    if (value.albumId === albumId) messages.push(value)
  })
  return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function saveMessage(message) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        id: message.id,
        album_id: message.albumId,
        guest_name: message.guestName || 'A Guest',
        text: message.text,
      })
      .select()
      .single()
    if (error) throw error
    return mapMessageFromDB(data)
  }
  await messageStore.setItem(message.id, message)
  return message
}

export async function deleteMessage(id) {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) throw error
    return
  }
  await messageStore.removeItem(id)
}


// ── Video Messages ─────────────────────────────────────────

export async function getVideoMessagesByAlbum(albumId) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('video_messages')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(mapVideoMessageFromDB)
  }
  // Local fallback — no video support in local mode
  return []
}

export async function saveVideoMessage({ id, albumId, guestName, videoBlob }) {
  if (isSupabaseConfigured()) {
    // Upload video file to Supabase Storage
    const ext = videoBlob.type.includes('mp4') ? 'mp4' : 'webm'
    const storagePath = `${albumId}/${id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('video-messages')
      .upload(storagePath, videoBlob, {
        contentType: videoBlob.type,
        cacheControl: '3600',
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('video-messages')
      .getPublicUrl(storagePath)

    // Save metadata to database
    const { data, error } = await supabase
      .from('video_messages')
      .insert([{
        id,
        album_id: albumId,
        guest_name: guestName || 'A Guest',
        storage_path: storagePath,
        video_url: urlData.publicUrl,
        file_size: videoBlob.size,
        mime_type: videoBlob.type,
      }])
      .select()
      .single()

    if (error) throw error
    return mapVideoMessageFromDB(data)
  }
  // Local fallback — not supported for video
  console.warn('Video messages require Supabase to be configured')
  return null
}

export async function deleteVideoMessage(id, storagePath) {
  if (isSupabaseConfigured()) {
    // Delete file from storage
    if (storagePath) {
      await supabase.storage.from('video-messages').remove([storagePath])
    }
    // Delete metadata from database
    const { error } = await supabase.from('video_messages').delete().eq('id', id)
    if (error) throw error
  }
}


// ── Realtime Subscriptions ──────────────────────────────────

/**
 * Subscribe to new photos for an album (used by slideshow/TV display).
 * Returns an unsubscribe function.
 */
export function subscribeToPhotos(albumId, callback) {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase
    .channel(`photos:${albumId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'photos',
        filter: `album_id=eq.${albumId}`,
      },
      (payload) => {
        callback(mapPhotoFromDB(payload.new))
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}

/**
 * Subscribe to new messages for an album.
 */
export function subscribeToMessages(albumId, callback) {
  if (!isSupabaseConfigured()) return () => {}

  const channel = supabase
    .channel(`messages:${albumId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `album_id=eq.${albumId}`,
      },
      (payload) => {
        callback(mapMessageFromDB(payload.new))
      }
    )
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}


// ── Settings (local only — no backend needed) ───────────────

export async function getSetting(key) {
  return settingsStore.getItem(key)
}

export async function saveSetting(key, value) {
  return settingsStore.setItem(key, value)
}

export async function getWeddingProfile() {
  return settingsStore.getItem('weddingProfile') || null
}

export async function saveWeddingProfile(profile) {
  return settingsStore.setItem('weddingProfile', profile)
}


// ── DB ↔ App Object Mappers ────────────────────────────────
// Convert between snake_case (Postgres) and camelCase (JS).

function mapAlbumFromDB(row) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    description: row.description,
    shareCode: row.share_code,
    passwordHash: row.password_hash,
    moderationEnabled: row.moderation_enabled,
    coverPhotoUrl: row.cover_photo_url,
    photoCount: row.photo_count,
    coupleType: row.couple_type || 'bride-groom',
    weddingDate: row.wedding_date || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapAlbumToDB(album) {
  return {
    id: album.id,
    owner_id: album.ownerId,
    name: album.name,
    description: album.description || null,
    share_code: album.shareCode,
    password_hash: album.passwordHash || null,
    moderation_enabled: album.moderationEnabled || false,
    cover_photo_url: album.coverPhotoUrl || null,
    photo_count: album.photoCount || 0,
    couple_type: album.coupleType || 'bride-groom',
    wedding_date: album.weddingDate || null,
  }
}

function mapPhotoFromDB(row) {
  const photo = {
    id: row.id,
    albumId: row.album_id,
    uploadedBy: row.uploaded_by,
    filename: row.filename,
    storagePath: row.storage_path,
    thumbnailPath: row.thumbnail_path,
    status: row.status,
    favorite: row.favorite,
    guestName: row.guest_name,
    uploadedAt: row.uploaded_at,
  }

  // Generate public URLs for photos stored in Supabase
  if (isSupabaseConfigured() && row.storage_path) {
    photo.dataUrl = getPhotoUrl(row.storage_path, 'photos')
    photo.thumbnailUrl = row.thumbnail_path
      ? getPhotoUrl(row.thumbnail_path, 'thumbnails')
      : photo.dataUrl
  }

  return photo
}

function mapPhotoToDB(photo) {
  return {
    id: photo.id,
    album_id: photo.albumId,
    uploaded_by: photo.uploadedBy || 'guest',
    filename: photo.filename || null,
    storage_path: photo.storagePath || '',
    thumbnail_path: photo.thumbnailPath || null,
    status: photo.status || 'approved',
    favorite: photo.favorite || false,
    guest_name: photo.guestName || null,
  }
}

function mapMessageFromDB(row) {
  return {
    id: row.id,
    albumId: row.album_id,
    guestName: row.guest_name,
    text: row.text,
    createdAt: row.created_at,
  }
}

function mapVideoMessageFromDB(row) {
  return {
    id: row.id,
    albumId: row.album_id,
    guestName: row.guest_name,
    storagePath: row.storage_path,
    videoUrl: row.video_url,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  }
}
