const LOGO_PRIMARY = `${import.meta.env.BASE_URL}ghost-logo-primary.png`;
const LOGO_SECONDARY = `${import.meta.env.BASE_URL}ghost-logo-secondary.png`;

async function imageToDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Logo read failed"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function loadQuoteLogos(): Promise<{
  primary: string | null;
  secondary: string | null;
}> {
  const [primary, secondary] = await Promise.all([
    imageToDataUrl(LOGO_PRIMARY),
    imageToDataUrl(LOGO_SECONDARY),
  ]);
  return { primary, secondary };
}

export const LOGO_PATHS = {
  primary: LOGO_PRIMARY,
  secondary: LOGO_SECONDARY,
};
