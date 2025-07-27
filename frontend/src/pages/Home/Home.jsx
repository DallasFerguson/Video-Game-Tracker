// src/pages/Home/Home.jsx - Removed library buttons and references
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { getTrendingGames } from '../../api/games';
import './Home.css';

export default function Home() {
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        setLoading(true);
        const games = await getTrendingGames(4);
        setTrendingGames(games);
      } catch (error) {
        console.error('Failed to fetch trending games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  return (
    <div className="home-page" style={{ padding: '20px', backgroundColor: '#f8f8f8', color: '#333' }}>
      {/*Hero Section*/}
      <section className="hero-section" style={{ 
        backgroundColor: '#f0f4f8', 
        padding: '40px 20px', 
        borderRadius: '12px',
        marginBottom: '40px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div className="hero-content">
          <h1 style={{ 
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: '#2a75bb'
          }}>Discover Your Next Game</h1>
          <p style={{ 
            fontSize: '1.2rem',
            marginBottom: '2rem',
            maxWidth: '800px',
            margin: '0 auto 2rem'
          }}>
            Search and discover games from across the gaming universe
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/search">
              <Button variant="primary" size="large">Search Games</Button>
            </Link>
            <Link to="/trending">
              <Button variant="secondary" size="large">View Trending</Button>
            </Link>
          </div>
        </div>
      </section>

      {/*Trending Games Section*/}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #eaeaea',
          paddingBottom: '10px'
        }}>
          <h2 style={{ margin: 0, color: '#2a75bb' }}>Trending Games</h2>
          <Link to="/trending" style={{ 
            color: '#2a75bb', 
            textDecoration: 'none',
            padding: '8px 16px',
            border: '1px solid #2a75bb',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}>
            View All
          </Link>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '20px'
          }}>
            {trendingGames.map(game => (
              <Link key={game.id} to={`/game/${game.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ 
                    height: '300px', 
                    backgroundColor: '#f0f0f0', 
                    position: 'relative' 
                  }}>
                    {game.cover && game.cover.image_id ? (
                      <img 
                        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
                        alt={game.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%' 
                      }}>
                        No Cover Available
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '15px', flexGrow: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 10px 0',
                      fontSize: '1.1rem',
                      color: '#333'
                    }}>{game.name}</h3>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {game.first_release_date && (
                        <span>{new Date(game.first_release_date * 1000).getFullYear()}</span>
                      )}
                      {game.rating && (
                        <span style={{ color: '#ffcb05' }}>★ {Math.round(game.rating / 10)}/10</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/*Features Section*/}
      <section style={{
        padding: '30px 20px',
        backgroundColor: '#f0f4f8',
        borderRadius: '12px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '30px', color: '#2a75bb' }}>Discover Games Easily</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🔍</div>
            <h3 style={{ marginBottom: '10px' }}>Search</h3>
            <p style={{ color: '#666' }}>Find games by title, genre, or platform</p>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🏆</div>
            <h3 style={{ marginBottom: '10px' }}>Trending</h3>
            <p style={{ color: '#666' }}>Discover what games are popular right now</p>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🎮</div>
            <h3 style={{ marginBottom: '10px' }}>Details</h3>
            <p style={{ color: '#666' }}>Get comprehensive information about any game</p>
          </div>
        </div>
      </section>
    </div>
  );
}
