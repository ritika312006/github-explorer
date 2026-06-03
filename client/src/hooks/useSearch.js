import { useState, useCallback } from 'react';
import { fetchUser, fetchRepos } from '../utils/api';

export function useSearch() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [totalRepos, setTotalRepos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (username) => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);
    setCurrentPage(1);

    try {
      const data = await fetchUser(username.trim());
      setUser(data.user);
      setRepos(data.repos);
      setTotalRepos(data.totalRepos);
      setCurrentPage(1);

      // Save to recently searched
      saveRecentSearch(data.user);
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (username) => {
    const nextPage = currentPage + 1;
    setLoadingMore(true);

    try {
      const data = await fetchRepos(username, nextPage);
      setRepos((prev) => [...prev, ...data.repos]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError('Failed to load more repositories.');
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage]);

  const reset = useCallback(() => {
    setUser(null);
    setRepos([]);
    setError(null);
    setCurrentPage(1);
  }, []);

  return {
    user, repos, totalRepos, currentPage,
    loading, loadingMore, error,
    search, loadMore, reset,
  };
}

// ---------------------------------------------------------------------------
// Recently searched — persisted in localStorage
// ---------------------------------------------------------------------------
function saveRecentSearch(user) {
  try {
    const key = 'gh_recent_searches';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter((u) => u.login !== user.login);
    const updated = [
      { login: user.login, name: user.name, avatarUrl: user.avatarUrl },
      ...filtered,
    ].slice(0, 5); // keep last 5
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (_) {}
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem('gh_recent_searches') || '[]');
  } catch (_) {
    return [];
  }
}

export function clearRecentSearches() {
  localStorage.removeItem('gh_recent_searches');
}