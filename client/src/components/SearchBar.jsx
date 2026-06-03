import { useState, useEffect, useRef } from 'react';
import { getRecentSearches, clearRecentSearches } from '../hooks/useSearch';
import './SearchBar.css';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setShowRecent(false);
    onSearch(query.trim());
    setRecentSearches(getRecentSearches());
  };

  const handleRecentClick = (login) => {
    setQuery(login);
    setShowRecent(false);
    onSearch(login);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
    setShowRecent(false);
  };

  return (
    <div className="searchbar-wrapper">
      <form className="searchbar-form" onSubmit={handleSubmit}>
        <div className="searchbar-input-wrap">
          <span className="searchbar-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="searchbar-input"
            placeholder="Enter a GitHub username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowRecent(true)}
            onBlur={() => setTimeout(() => setShowRecent(false), 150)}
            disabled={loading}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="searchbar-clear"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            >✕</button>
          )}
        </div>
        <button type="submit" className="searchbar-btn" disabled={loading || !query.trim()}>
          {loading ? <span className="searchbar-spinner" /> : 'Search'}
        </button>
      </form>

      {showRecent && recentSearches.length > 0 && (
        <div className="searchbar-recent">
          <div className="searchbar-recent-header">
            <span>Recent Searches</span>
            <button onClick={handleClearRecent}>Clear</button>
          </div>
          {recentSearches.map((u) => (
            <div
              key={u.login}
              className="searchbar-recent-item"
              onClick={() => handleRecentClick(u.login)}
            >
              <img src={u.avatarUrl} alt={u.login} />
              <div>
                <span className="recent-name">{u.name || u.login}</span>
                <span className="recent-login">@{u.login}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}