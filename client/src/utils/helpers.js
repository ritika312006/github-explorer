/**
 * Format a date string into a readable format
 * e.g. "2 days ago", "3 months ago"
 */
export function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Format a number with k/m suffix
 * e.g. 1200 -> "1.2k"
 */
export function formatNumber(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}m`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num?.toString() || '0';
}

/**
 * Format a date to a readable string
 * e.g. "Jan 2020"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

/**
 * Get a color for a programming language
 */
export function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    PHP: '#4F5D95',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Vue: '#41b883',
    Dart: '#00B4AB',
    Scala: '#c22d40',
    R: '#198CE7',
  };
  return colors[language] || '#8b949e';
}