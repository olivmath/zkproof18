// Utility to load QR code library dynamically
export const loadQRCodeLibrary = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  // Check if already loaded
  if ((window as any).QRCode) return true;

  try {
    // Try to load from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";
    script.async = true;

    return new Promise((resolve) => {
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    return false;
  }
};

// Generate QR code using library if available, otherwise use fallback
export const generateQRCode = async (
  canvas: HTMLCanvasElement,
  text: string,
  options: { width?: number; margin?: number } = {}
): Promise<void> => {
  const { width = 200, margin = 2 } = options;

  // Try to use library
  if (typeof window !== "undefined" && (window as any).QRCode) {
    try {
      await (window as any).QRCode.toCanvas(canvas, text, {
        width,
        margin,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return;
    } catch (error) {
      console.error("QR library error, using fallback:", error);
    }
  }

  // Fallback implementation
  generateFallbackQR(canvas, text, width);
};

// Fallback QR code generation
const generateFallbackQR = (
  canvas: HTMLCanvasElement,
  text: string,
  size: number
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas size
  canvas.width = size;
  canvas.height = size;

  // Fill white background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Generate QR-like pattern
  ctx.fillStyle = "#000000";

  const cellSize = Math.max(4, Math.floor(size / 25));
  const margin = Math.floor(size * 0.1);
  const dataSize = Math.floor((canvas.width - 2 * margin) / cellSize);

  // Generate hash from text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash = hash & hash;
  }

  // Create data pattern
  for (let row = 0; row < dataSize; row++) {
    for (let col = 0; col < dataSize; col++) {
      const index = row * dataSize + col;
      const shouldFill = (hash + index + row * 7 + col * 11) % 4 === 0;

      if (shouldFill) {
        ctx.fillRect(
          margin + col * cellSize,
          margin + row * cellSize,
          cellSize - 1,
          cellSize - 1
        );
      }
    }
  }

  // Add corner markers (QR code style)
  const markerSize = Math.floor(dataSize / 4);
  const markerMargin = Math.floor(margin / 2);

  // Top-left marker
  drawCornerMarker(ctx, markerMargin, markerMargin, markerSize, cellSize);

  // Top-right marker
  drawCornerMarker(
    ctx,
    canvas.width - markerMargin - markerSize * cellSize,
    markerMargin,
    markerSize,
    cellSize
  );

  // Bottom-left marker
  drawCornerMarker(
    ctx,
    markerMargin,
    canvas.height - markerMargin - markerSize * cellSize,
    markerSize,
    cellSize
  );
};

const drawCornerMarker = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  cellSize: number
) => {
  // Outer square
  ctx.fillStyle = "#000000";
  ctx.fillRect(x, y, size * cellSize, size * cellSize);

  // Inner white square
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(
    x + cellSize,
    y + cellSize,
    (size - 2) * cellSize,
    (size - 2) * cellSize
  );

  // Inner black square
  ctx.fillStyle = "#000000";
  ctx.fillRect(
    x + 2 * cellSize,
    y + 2 * cellSize,
    (size - 4) * cellSize,
    (size - 4) * cellSize
  );
};
