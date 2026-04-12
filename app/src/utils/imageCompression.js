/**
 * Client-side image compression utility.
 *
 * Resizes images to a max dimension and compresses to JPEG before upload.
 * This dramatically reduces upload time and storage costs:
 *   - iPhone 15 photo: ~5MB → ~300KB (94% reduction)
 *   - Android flagship: ~8MB → ~400KB (95% reduction)
 *
 * Uses Canvas API — no external dependencies.
 */

const MAX_WIDTH = 2400
const MAX_HEIGHT = 2400
const JPEG_QUALITY = 0.82
const MAX_FILE_SIZE = 15 * 1024 * 1024 // Skip compression for files > 15MB (let server handle)

/**
 * Compress an image File/Blob.
 *
 * @param {File} file — The original image file
 * @param {Object} [options]
 * @param {number} [options.maxWidth=2400]
 * @param {number} [options.maxHeight=2400]
 * @param {number} [options.quality=0.82] — JPEG quality 0-1
 * @returns {Promise<File>} — Compressed file (or original if compression fails/not needed)
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = MAX_WIDTH,
    maxHeight = MAX_HEIGHT,
    quality = JPEG_QUALITY,
  } = options

  // Skip non-image files
  if (!file.type.startsWith('image/')) return file

  // Skip GIFs (they have animation), SVGs (they're vector)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

  // Skip very large files (canvas might choke)
  if (file.size > MAX_FILE_SIZE) return file

  // Skip tiny files (already small enough)
  if (file.size < 100 * 1024) return file

  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = bitmap

    // Calculate new dimensions maintaining aspect ratio
    let newWidth = width
    let newHeight = height

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      newWidth = Math.round(width * ratio)
      newHeight = Math.round(height * ratio)
    } else if (file.type === 'image/jpeg' && file.size < 500 * 1024) {
      // Already JPEG and reasonably small — skip
      bitmap.close()
      return file
    }

    // Create canvas and draw resized image
    const canvas = new OffscreenCanvas(newWidth, newHeight)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, newWidth, newHeight)
    bitmap.close()

    // Convert to JPEG blob
    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality,
    })

    // Only use compressed version if it's actually smaller
    if (blob.size >= file.size) return file

    // Create a new File with the original name but .jpg extension
    const name = file.name.replace(/\.[^.]+$/, '.jpg')
    return new File([blob], name, {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    })
  } catch (err) {
    // If compression fails for any reason, return the original
    console.warn('Image compression failed, using original:', err)
    return file
  }
}

/**
 * Compress multiple image files.
 * @param {File[]} files
 * @param {Object} [options]
 * @returns {Promise<File[]>}
 */
export async function compressImages(files, options = {}) {
  return Promise.all(files.map(f => compressImage(f, options)))
}
