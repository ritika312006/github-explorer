const DEFAULT_TTL_MS = parseInt(process.env.CACHE_TTL_MS) || 60_000;

const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

function set(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function del(key) { store.delete(key); }
function clear() { store.clear(); }

function stats() {
  const now = Date.now();
  let active = 0, expired = 0;
  for (const [, entry] of store) {
    if (now > entry.expiresAt) expired++;
    else active++;
  }
  return { total: store.size, active, expired };
}

module.exports = { get, set, del, clear, stats };