import React from 'react';
import './GameCover.css';

const GameCover = ({ cover, name, size = 'medium' }) => {
  const getCoverUrl = (cover) => {
    if (!cover) return null;
    
    // Handle different cover data structures
    if (typeof cover === 'string') {
      return cover.startsWith('http') ? cover : `https:${cover}`;
    }
    
    if (!cover.url && !cover.image_id) return null;
    
    // If image_id is available, use that (preferred method)
    if (cover.image_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
    }
    
    // Otherwise use url and try to get a better version
    let url = cover.url;
    if (url.startsWith('//')) url = `https:${url}`;
    
    // Try to get higher resolution version
    return url.replace('t_thumb', 't_cover_big');
  };

  const coverUrl = getCoverUrl(cover);
  
  return (
    <div className={`game-cover ${size}`}>
      {coverUrl ? (
        <img src={coverUrl} alt={name || 'Game cover'} />
      ) : (
        <div className="game-cover-placeholder">
          No Cover Available
        </div>
      )}
    </div>
  );
};

export default GameCover;