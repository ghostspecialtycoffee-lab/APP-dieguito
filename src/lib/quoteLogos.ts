const LOGO_PRIMARY = `${import.meta.env.BASE_URL}ghost-logo-primary.svg`;
const LOGO_SECONDARY = `${import.meta.env.BASE_URL}ghost-logo-secondary.svg`;

async function svgToDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const svgText = await response.text();
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Logo load failed"));
      img.src = objectUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || 320;
    canvas.height = img.naturalHeight || 80;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return null;
    }
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(objectUrl);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

export async function loadQuoteLogos(): Promise<{
  primary: string | null;
  secondary: string | null;
}> {
  const [primary, secondary] = await Promise.all([
    svgToDataUrl(LOGO_PRIMARY),
    svgToDataUrl(LOGO_SECONDARY),
  ]);
  return { primary, secondary };
}

export const LOGO_PATHS = {
  primary: LOGO_PRIMARY,
  secondary: LOGO_SECONDARY,
};
