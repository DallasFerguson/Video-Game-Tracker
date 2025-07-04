export const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPlaytime = (hours) => {
  if (!hours) return '0h';
  if (hours < 1) return '<1h';
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  return `${Math.round(hours)}h`;
};

export const getStatusColor = (status) => {
  const statusColors = {
    playing: 'var(--primary-color)',
    completed: 'var(--success-color)',
    plan_to_play: 'var(--secondary-color)',
    dropped: 'var(--danger-color)'
  };
  return statusColors[status] || 'var(--dark-color)';
};