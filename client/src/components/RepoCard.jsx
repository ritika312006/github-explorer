import { useState, useEffect } from 'react';
import { timeAgo, formatNumber, getLanguageColor } from '../utils/helpers';
import { fetchRepoDetail } from '../utils/api';
import './RepoCard.css';

function getPinned() {
  try { return JSON.parse(localStorage.getItem('gh_pinned') || '[]'); }
  catch (_) { return []; }
}

function savePinned(pins) {
  localStorage.setItem('gh_pinned', JSON.stringify(pins));
}

export default function RepoCard({ repo, username }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pinned, setPinned] = useState(() => getPinned().includes(repo.fullName));

  const handleExpand = async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (!detail) {
      setLoadingDetail(true);
      try {
        const data = await fetchRepoDetail(username, repo.name);
        setDetail(data.repo);
      } catch (_) {
        console.log('Could not load detail');
      } finally {
        setLoadingDetail(false);
      }
    }
  };

  const handlePin = (e) => {
    e.stopPropagation();
    const pins = getPinned();
    if (pinned) {
      savePinned(pins.filter((p) => p !== repo.fullName));
    } else {
      savePinned([...pins, repo.fullName]);
    }
    setPinned(!pinned);
  };

  return (
    <div className={`repo-card ${expanded ? 'repo-card--expanded' : ''} ${pinned ? 'repo-card--pinned' : ''}`}>
      <div className="repo-card-main" onClick={handleExpand}>
        <div className="repo-card-header">
          <div className="repo-card-title-wrap">
            <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="repo-name" onClick={(e) => e.stopPropagation()}>{repo.name}</a>
            {repo.isForked && <span className="repo-badge repo-badge--fork">Fork</span>}
            {repo.isArchived && <span className="repo-badge repo-badge--archived">Archived</span>}
          </div>
          <div className="repo-card-actions">
            <button className={`repo-pin-btn ${pinned ? 'repo-pin-btn--active' : ''}`} onClick={handlePin} title={pinned ? 'Unpin' : 'Pin'}>
              {pinned ? '📌' : '📍'}
            </button>
            <span className={`repo-expand-icon ${expanded ? 'repo-expand-icon--open' : ''}`}>v</span>
          </div>
        </div>

        {repo.description && <p className="repo-description">{repo.description}</p>}

        {repo.topics && repo.topics.length > 0 && (
          <div className="repo-topics">
            {repo.topics.slice(0, 5).map((topic) => (
              <span key={topic} className="repo-topic">{topic}</span>
            ))}
          </div>
        )}

        <div className="repo-meta">
          {repo.language && (
            <span className="repo-meta-item">
              <span className="repo-lang-dot" style={{ background: getLanguageColor(repo.language) }} />
              {repo.language}
            </span>
          )}
          {repo.stargazersCount > 0 && <span className="repo-meta-item">⭐ {formatNumber(repo.stargazersCount)}</span>}
          {repo.forksCount > 0 && <span className="repo-meta-item">🍴 {formatNumber(repo.forksCount)}</span>}
          {repo.openIssuesCount > 0 && <span className="repo-meta-item">{repo.openIssuesCount} issues</span>}
          <span className="repo-meta-item repo-meta-updated">Updated {timeAgo(repo.updatedAt)}</span>
        </div>
      </div>

      {expanded && (
        <div className="repo-detail">
          {loadingDetail && <div className="repo-detail-loading">Loading details...</div>}
          {!loadingDetail && detail && (
            <div className="repo-detail-grid">
              <div className="repo-detail-item">
                <span className="detail-label">Default Branch</span>
                <span className="detail-value">{detail.defaultBranch}</span>
              </div>
              <div className="repo-detail-item">
                <span className="detail-label">Open Issues</span>
                <span className="detail-value">{detail.openIssuesCount}</span>
              </div>
              <div className="repo-detail-item">
                <span className="detail-label">Watchers</span>
                <span className="detail-value">{detail.subscribersCount}</span>
              </div>
              {detail.license && (
                <div className="repo-detail-item">
                  <span className="detail-label">License</span>
                  <span className="detail-value">{detail.license}</span>
                </div>
              )}
              {detail.homepage && (
                <div className="repo-detail-item">
                  <span className="detail-label">Homepage</span>
                  <a href={detail.homepage} target="_blank" rel="noreferrer" className="detail-link">{detail.homepage}</a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}