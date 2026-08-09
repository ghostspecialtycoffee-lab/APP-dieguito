/** Cloud backend (Convex) vs datos locales en el navegador */
export const isCloudMode = Boolean(import.meta.env.VITE_CONVEX_URL);

export const appBasePath = import.meta.env.BASE_URL.replace(/\/$/, "");
