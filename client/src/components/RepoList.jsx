import { useState, useMemo } from 'react';
import RepoCard from './RepoCard';
import './RepoList.css';

const SORT_OPTIONS = [
  { value: 'updated', label: 'Recently Updated' },
  { value: 'stars', label: 'Most Stars' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'forks', label: 'Most Forks' },
];

export default function RepoList({ repos, totalRepos, username, onLoadMore, loadingMore }) {
  const [sort, setSort] = useState('updated');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = [...repos];

    if (search.trim()) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sort) {
      case 'stars': result.sort((a, b) => b.stargazersCount - a.stargazersCount); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'forks': result.sort((a, b) => b.forksCount - a.forksCount); break;
      case 'updated': result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); break;
      default: break;
    }

    return result;
  }, [repos, sort, search]);

  const hasMore = repos.length < totalRepos;

  return (
    <div className="repolist">
      <div className="repolist-toolbar">
        <div className="repolist-info">
          <h2 className="repolist-title">Repositories</h2>
          <span className="repolist-count">{totalRepos}</span>
        </div>

        <div className="repolist-controls">
          <div className="repolist-search-wrap">
            <svg className="repolist-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Find a repository..."
              className="repolist-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="repolist-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="repolist-empty">
          <span>🔍</span>
          <p>No repositories match your search.</p>
        </div>
      ) : (
        <div className="repolist-grid">
          {filtered.map((repo) => (
            <RepoCard key={repo.id} repo={repo} username={username} />
          ))}
        </div>
      )}

      {hasMore && !search && (
        <div className="repolist-loadmore">
          <button
            className="repolist-loadmore-btn"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <><span className="loadmore-spinner" /> Loading...</>
            ) : (
              `Load More (${totalRepos - repos.length} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}