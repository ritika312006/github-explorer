import { useEffect, useState } from 'react';
import { fetchTrending } from '../utils/api';
import { formatNumber, timeAgo, getLanguageColor } from '../utils/helpers';
import './TrendingRepos.css';

export default function TrendingRepos({ onSearch }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrending()
      .then((data) => setRepos(data.repos))
      .catch(() => setError('Could not load trending repos'))
      .finally(() => setLoading(false));
  }, []);

  if (error) return null;

  return (
    <div className="trending">
      <div className="trending-header">
        <h2 className="trending-title">
          🔥 Trending This Week
        </h2>
        <span className="trending-subtitle">Most starred repos created in the last 7 days</span>
      </div>

      {loading ? (
        <div className="trending-loading">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="trending-skeleton" />
          ))}
        </div>
      ) : (
        <div className="trending-list">
          {repos.map((repo, index) => (
            <div key={repo.id} className="trending-item">
              <span className="trending-rank">#{index + 1}</span>
              <div className="trending-info">
                <div className="trending-name-row">
                  <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="trending-name">
                    {repo.fullName}
                  </a>
                  {repo.language && (
                    <span className="trending-lang">
                      <span className="trending-lang-dot" style={{ background: getLanguageColor(repo.language) }} />
                      {repo.language}
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="trending-desc">{repo.description}</p>
                )}
                <div className="trending-meta">
                  <span>⭐ {formatNumber(repo.stargazersCount)}</span>
                  <span>🍴 {formatNumber(repo.forksCount)}</span>
                  <span>Updated {timeAgo(repo.updatedAt)}</span>
                  <button
                    className="trending-explore-btn"
                    onClick={() => onSearch(repo.fullName.split('/')[0])}
                  >
                    View Author →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}