const HOST = (import.meta.env.VITE_API_HOST || '').replace(/\/+$/, '');

export const apiUrl = (path) =>
  import.meta.env.DEV
    ? `/api${path}`
    : `${HOST}${path}`;
