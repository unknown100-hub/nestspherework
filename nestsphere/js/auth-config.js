(() => {
  if (window.NESTSPHERE_API_URL) return;
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const hostname = window.location.hostname || 'localhost';
  window.NESTSPHERE_API_URL = `${protocol}//${hostname}:5000`;
})();
