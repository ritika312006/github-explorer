const express = require('express');
const fetch = require('node-fetch');
const cache = require('../cache/memoryCache');
const { createError } = require('../middleware/errorHandler');

const router = express.Router();
const GITHUB_API = 'https://api.github.com';
const REPOS_PER_PAGE = 30;

function githubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function githubFetch(url) {
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) throw createError(404, 'GitHub user not found');
  if (res.status === 403) {
    const body = await res.json().catch(() => ({}));
    const msg = body.message?.includes('rate limit')
      ? 'GitHub API rate limit exceeded. Please try again in a minute.'
      : 'GitHub API access forbidden.';
    throw createError(403, msg);
  }
  if (!res.ok) throw createError(res.status, `GitHub API error: ${res.statusText}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// GET /api/github/trending/repos
// ---------------------------------------------------------------------------
router.get('/trending/repos', async (req, res, next) => {
  try {
    const cacheKey = 'trending:repos';
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    const date = new Date();
    date.setDate(date.getDate() - 7);
    const dateStr = date.toISOString().split('T')[0];

    const data = await githubFetch(
      `${GITHUB_API}/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=10`
    );

    const payload = {
      repos: data.items.map(normaliseRepo),
      fromCache: false,
    };

    cache.set(cacheKey, payload, 300_000);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/github/:username
// ---------------------------------------------------------------------------
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const cacheKey = `user:${username.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    const [user, repos] = await Promise.all([
      githubFetch(`${GITHUB_API}/users/${username}`),
      githubFetch(`${GITHUB_API}/users/${username}/repos?per_page=${REPOS_PER_PAGE}&page=1&sort=updated`),
    ]);

    const payload = {
      user: normaliseUser(user),
      repos: repos.map(normaliseRepo),
      totalRepos: user.public_repos,
      page: 1,
      perPage: REPOS_PER_PAGE,
      fromCache: false,
    };

    cache.set(cacheKey, payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/github/:username/repos?page=2
// ---------------------------------------------------------------------------
router.get('/:username/repos', async (req, res, next) => {
  try {
    const { username } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const cacheKey = `repos:${username.toLowerCase()}:${page}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    const repos = await githubFetch(
      `${GITHUB_API}/users/${username}/repos?per_page=${REPOS_PER_PAGE}&page=${page}&sort=updated`
    );

    const payload = {
      repos: repos.map(normaliseRepo),
      page,
      perPage: REPOS_PER_PAGE,
      fromCache: false,
    };
    cache.set(cacheKey, payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/github/:username/repos/:repo
// ---------------------------------------------------------------------------
router.get('/:username/repos/:repo', async (req, res, next) => {
  try {
    const { username, repo } = req.params;
    const cacheKey = `repo:${username.toLowerCase()}:${repo.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    const data = await githubFetch(`${GITHUB_API}/repos/${username}/${repo}`);
    const payload = { repo: normaliseRepoDetail(data), fromCache: false };
    cache.set(cacheKey, payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Normalisers
// ---------------------------------------------------------------------------
function normaliseUser(u) {
  return {
    login: u.login, name: u.name, bio: u.bio,
    avatarUrl: u.avatar_url, htmlUrl: u.html_url,
    company: u.company, blog: u.blog, location: u.location,
    twitterUsername: u.twitter_username,
    publicRepos: u.public_repos, followers: u.followers,
    following: u.following, createdAt: u.created_at,
  };
}

function normaliseRepo(r) {
  return {
    id: r.id, name: r.name, fullName: r.full_name,
    description: r.description, htmlUrl: r.html_url,
    language: r.language, stargazersCount: r.stargazers_count,
    forksCount: r.forks_count, openIssuesCount: r.open_issues_count,
    defaultBranch: r.default_branch, isForked: r.fork,
    isArchived: r.archived, topics: r.topics || [],
    updatedAt: r.updated_at, createdAt: r.created_at,
    license: r.license?.spdx_id || null,
  };
}

function normaliseRepoDetail(r) {
  return {
    ...normaliseRepo(r),
    homepage: r.homepage,
    hasWiki: r.has_wiki,
    subscribersCount: r.subscribers_count,
  };
}

module.exports = router;