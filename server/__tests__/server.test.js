const cache = require('../cache/memoryCache');

describe('memoryCache', () => {
  beforeEach(() => cache.clear());

  test('returns null for missing key', () => {
    expect(cache.get('x')).toBeNull();
  });

  test('stores and retrieves a value', () => {
    cache.set('k', { name: 'octocat' });
    expect(cache.get('k')).toEqual({ name: 'octocat' });
  });

  test('expires after TTL', async () => {
    cache.set('k2', 'temp', 50);
    await new Promise(r => setTimeout(r, 100));
    expect(cache.get('k2')).toBeNull();
  });
});

const request = require('supertest');
const app = require('../index');

describe('GET /api/health', () => {
  test('returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});