/**
 * EXIF metadata stripping utility.
 * Removes all metadata (GPS, camera info, timestamps, etc.) from images
 * before they're stored — a core privacy promise.
 */

/**
 * Strips EXIF/metadata from an image file by re-encoding it through canvas.
 * Returns a clean Blob with no embedded metadata.
 */
export async function stripMetadata(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to strip metadata'));
            return;
          }
          // Preserve original filename
          const cleanFile = new File([blob], file.name, {
            type: file.type || 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(cleanFile);
        },
        file.type || 'image/jpeg',
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for metadata stripping'));
    };

    img.src = url;
  });
}

/**
 * Reads EXIF data from a file (for displaying what was removed).
 */
export async function readMetadata(file) {
  try {
    const ExifReader = await import('exifreader');
    const arrayBuffer = await file.arrayBuffer();
    const tags = ExifReader.load(arrayBuffer);

    const interesting = {};
    const sensitiveKeys = [
      'GPSLatitude', 'GPSLongitude', 'GPSAltitude',
      'DateTimeOriginal', 'DateTime', 'DateTimeDigitized',
      'Make', 'Model', 'Software', 'LensMake', 'LensModel',
      'SerialNumber', 'OwnerName', 'Artist', 'Copyright',
    ];

    for (const key of sensitiveKeys) {
      if (tags[key]) {
        interesting[key] = tags[key].description || tags[key].value;
      }
    }

    return {
      found: Object.keys(interesting).length > 0,
      tags: interesting,
      totalTags: Object.keys(tags).length,
    };
  } catch {
    return { found: false, tags: {}, totalTags: 0 };
  }
}
