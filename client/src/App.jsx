import { useState } from 'react';
import SearchBar from './components/SearchBar';
import UserProfile from './components/UserProfile';
import RepoList from './components/RepoList';
import LanguageChart from './components/LanguageChart';
import TopReposChart from './components/TopReposChart';
import TrendingRepos from './components/TrendingRepos';
import { ProfileSkeleton, RepoListSkeleton } from './components/SkeletonLoader';
import { useSearch } from './hooks/useSearch';
import './styles/global.css';
import './App.css';

export default function App() {
  const {
    user, repos, totalRepos, loading,
    loadingMore, error, search, loadMore, reset
  } = useSearch();

  const [searched, setSearched] = useState(false);

  const handleSearch = (username) => {
    setSearched(true);
    search(username);
  };

  const handleReset = () => {
    reset();
    setSearched(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo" onClick={handleReset}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitExplorer</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {!searched && (
          <div className="app-hero">
            <div className="app-hero-glow" />
            <h1 className="app-hero-title">
              Explore GitHub
              <span className="app-hero-gradient"> Profiles</span>
            </h1>
            <p className="app-hero-subtitle">
              Search any GitHub username to explore their profile,
              repositories, languages, and more.
            </p>
            <SearchBar onSearch={handleSearch} loading={loading} />
            <div className="app-hero-suggestions">
              <span>Try:</span>
              {['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'].map((u) => (
                <button key={u} className="app-suggestion-btn" onClick={() => handleSearch(u)}>
                  @{u}
                </button>
              ))}
            </div>
            <TrendingRepos onSearch={handleSearch} />
          </div>
        )}

        {searched && (
          <div className="app-content">
            <div className="app-search-bar">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>

            {error && (
              <div className="app-error">
                <span className="app-error-icon">⚠️</span>
                <div>
                  <p className="app-error-title">Something went wrong</p>
                  <p className="app-error-msg">{error}</p>
                </div>
              </div>
            )}

            {loading && (
              <>
                <ProfileSkeleton />
                <RepoListSkeleton />
              </>
            )}

            {!loading && user && (
              <>
                <UserProfile user={user} />
                {repos.length > 0 && (
                  <div className="charts-row">
                    <LanguageChart repos={repos} />
                    <TopReposChart repos={repos} />
                  </div>
                )}
                <RepoList
                  repos={repos}
                  totalRepos={totalRepos}
                  username={user.login}
                  onLoadMore={() => loadMore(user.login)}
                  loadingMore={loadingMore}
                />
              </>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built using React + Node.js · Data from GitHub API</p>
      </footer>
    </div>
  );
}