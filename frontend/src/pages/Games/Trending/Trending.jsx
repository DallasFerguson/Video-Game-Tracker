// src/pages/Games/Trending/Trending.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTrendingGames } from '../../../api/games';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import './Trending.css';

const Trending = () => {
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        setLoading(true);
        // Fetch more games to ensure we get recognizable titles
        const games = await getTrendingGames(10);
        setTrendingGames(games);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending games:', err);
        setError(err.message || 'Failed to fetch trending games');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  // Function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  // Function to safely get the cover image URL
  const getCoverUrl = (cover) => {
    if (!cover || !cover.image_id) {
      return 'https://via.placeholder.com/264x374?text=No+Cover';
    }
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
  };

  if (loading) {
    return (
      <div className="trending-page" style={{textAlign: 'center', padding: '40px'}}>
        <h1>Trending Games</h1>
        <p className="subtitle">Discovering what's popular right now...</p>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-page" style={{textAlign: 'center', padding: '40px'}}>
        <h1>Trending Games</h1>
        <p className="subtitle">Something went wrong</p>
        <div style={{
          backgroundColor: '#fff0f0',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <p style={{color: '#e3350d'}}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#2a75bb',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-page" style={{
      backgroundColor: '#f8f8f8',
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        color: '#2a75bb',
        marginBottom: '10px',
        textAlign: 'center'
      }}>Trending Games</h1>
      
      <p className="subtitle" style={{
        textAlign: 'center',
        color: '#666',
        marginBottom: '40px'
      }}>The hottest games right now</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '30px'
      }}>
        {trendingGames.map(game => (
          <Link 
            key={game.id} 
            to={`/game/${game.id}`} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{
                height: '350px',
                backgroundColor: '#f0f0f0',
                position: 'relative'
              }}>
                <img 
                  src={getCoverUrl(game.cover)} 
                  alt={game.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {game.rating && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255, 203, 5, 0.9)',
                    color: '#333',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {Math.round(game.rating)}%
                  </div>
                )}
              </div>
              
              <div style={{
                padding: '20px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '18px',
                  color: '#333'
                }}>
                  {game.name}
                </h3>
                
                <div style={{
                  marginTop: 'auto',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  {game.first_release_date && (
                    <span>Released: {formatDate(game.first_release_date)}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Trending;
