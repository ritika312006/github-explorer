import { formatNumber, formatDate } from '../utils/helpers';
import './UserProfile.css';

export default function UserProfile({ user }) {
  return (
    <div className="profile-card">
      <div className="profile-avatar-wrap">
        <img src={user.avatarUrl} alt={user.login} className="profile-avatar" />
        <div className="profile-avatar-glow" />
      </div>

      <div className="profile-info">
        <div className="profile-names">
          <h1 className="profile-name">{user.name || user.login}</h1>
          <a href={user.htmlUrl} target="_blank" rel="noreferrer" className="profile-login">@{user.login}</a>
        </div>

        {user.bio && <p className="profile-bio">{user.bio}</p>}

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">{formatNumber(user.followers)}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="stat-value">{formatNumber(user.following)}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="stat-value">{formatNumber(user.publicRepos)}</span>
            <span className="stat-label">Repos</span>
          </div>
        </div>

        <div className="profile-meta">
          {user.company && <span className="profile-meta-item">🏢 {user.company}</span>}
          {user.location && <span className="profile-meta-item">📍 {user.location}</span>}
          {user.blog && (
            <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="profile-meta-item profile-meta-link">
              🔗 {user.blog}
            </a>
          )}
          {user.twitterUsername && (
            <a href={`https://twitter.com/${user.twitterUsername}`} target="_blank" rel="noreferrer" className="profile-meta-item profile-meta-link">
              🐦 @{user.twitterUsername}
            </a>
          )}
          <span className="profile-meta-item">📅 Joined {formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}