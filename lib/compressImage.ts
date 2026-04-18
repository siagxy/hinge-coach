/**
 * Browser-only: resize and JPEG-compress images before storing or sending to API.
 */
function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

export async function compressImageFileToJpegBase64(
  file: File,
  options?: { maxWidth?: number; quality?: number }
): Promise<{ mediaType: "image/jpeg"; data: string }> {
  const maxWidth = options?.maxWidth ?? 960;
  const quality = options?.quality ?? 0.82;
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageFromUrl(url);
    const scale = Math.min(1, maxWidth / img.width);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const comma = dataUrl.indexOf(",");
    const data = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
    return { mediaType: "image/jpeg", data };
  } finally {
    URL.revokeObjectURL(url);
  }
}
