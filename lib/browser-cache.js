export async function fetchWithLocalCache(cacheKey, url, options = {}) {
  const { ttlMs = 1000 * 60 * 60 * 24, forceRefresh = false } = options;

  if (typeof window === "undefined") {
    const response = await fetch(url, { cache: "no-store" });
    return response.json();
  }

  const storageKey = `medical-outcomes-explorer:${cacheKey}`;

  if (!forceRefresh) {
    const cachedValue = window.localStorage.getItem(storageKey);

    if (cachedValue) {
      const parsed = JSON.parse(cachedValue);
      if (Date.now() - parsed.storedAt < ttlMs) {
        return parsed.payload;
      }
    }
  }

  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({ storedAt: Date.now(), payload }),
  );
  return payload;
}
