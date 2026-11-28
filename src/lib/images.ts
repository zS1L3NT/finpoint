// Client-side image shrinking for Record files: phone photos of receipts are mostly
// pixels nobody needs, and every byte is stored locally, backed up and synced to Drive.

const MAX_EDGE = 2400
const QUALITY = 0.82

/**
 * Re-encodes a photo as WebP with its longest edge at most 2400px. Returns the original
 * when the browser cannot decode it (HEIC outside Safari), for animated or vector
 * formats, or when the result would not be smaller.
 */
export async function shrinkImage(file: Blob): Promise<Blob> {
	if (
		!/^image\/(jpeg|png|webp|heic|heif|avif|bmp)$/.test(file.type) ||
		typeof createImageBitmap === "undefined" ||
		typeof OffscreenCanvas === "undefined"
	)
		return file
	// Bitmaps follow the photo's EXIF orientation, so rotated phone shots stay upright.
	const bitmap = await createImageBitmap(file).catch(() => null)
	if (!bitmap) return file
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
	const canvas = new OffscreenCanvas(
		Math.round(bitmap.width * scale),
		Math.round(bitmap.height * scale),
	)
	canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
	bitmap.close()
	const out = await canvas.convertToBlob({ type: "image/webp", quality: QUALITY })
	return out.size < file.size ? out : file
}
