import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getGameDetails } from '../../../api/games';
import { LibraryContext } from '../../../contexts/LibraryContext';
import { WishlistContext } from '../../../contexts/WishlistContext';
import { NotificationContext } from '../../../contexts/NotificationContext';
import GameStatus from '../../../components/games/GameStatus/GameStatus';
import Button from '../../../components/ui/Button/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { library, addToLibrary, updateInLibrary } = useContext(LibraryContext);
  const { wishlist, addToWishlist } = useContext(WishlistContext);
  const { notify } = useContext(NotificationContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find this game in library or wishlist if it exists
  const libraryEntry = library.find(item => item.gameId === parseInt(id));
  const isInWishlist = wishlist.some(item => item.gameId === parseInt(id));

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const gameData = await getGameDetails(id);
        setGame(gameData);
      } catch (err) {
        setError(err.message || 'Failed to load game details');
        notify?.('Failed to load game details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id, notify]);

  const handleAddToLibrary = (status = 'plan_to_play') => {
    try {
      // Prepare game data for library
      const gameData = {
        gameId: parseInt(id),
        name: game.name,
        cover: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null,
        status,
        rating: 0,
        playtime: 0
      };
      
      addToLibrary(gameData);
    } catch (err) {
      notify?.('Failed to add game to library', 'error');
    }
  };

  const handleAddToWishlist = () => {
    try {
      // Prepare game data for wishlist
      const gameData = {
        gameId: parseInt(id),
        name: game.name,
        cover: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null
      };
      
      addToWishlist(gameData);
    } catch (err) {
      notify?.('Failed to add game to wishlist', 'error');
    }
  };

  if (loading) {
    return (
      <div className="game-detail-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-detail-error">
        <p>{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-detail-not-found">
        <h2>Game not found</h2>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="game-detail">
      <div className="game-header">
        <div className="game-cover">
          {game.cover ? (
            <img 
              src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`} 
              alt={game.name} 
            />
          ) : (
            <div className="game-no-cover">No Cover Available</div>
          )}
        </div>

        <div className="game-info">
          <h1>{game.name}</h1>
          
          <div className="game-meta">
            {game.first_release_date && (
              <span className="release-date">
                {new Date(game.first_release_date * 1000).getFullYear()}
              </span>
            )}
            {game.genres?.length > 0 && (
              <span className="genres">
                {game.genres.map(g => g.name).join(', ')}
              </span>
            )}
            {game.platforms?.length > 0 && (
              <span className="platforms">
                {game.platforms.map(p => p.name).join(', ')}
              </span>
            )}
          </div>

          <div className="game-actions">
            {libraryEntry ? (
              <GameStatus 
                gameId={parseInt(id)} 
                initialStatus={libraryEntry.status}
                onUpdate={(newStatus) => {
                  updateInLibrary(parseInt(id), { status: newStatus });
                  notify?.('Status updated', 'success');
                }}
              />
            ) : (
              <Button 
                variant="primary" 
                onClick={() => handleAddToLibrary()}
              >
                Add to Library
              </Button>
            )}

            {!isInWishlist && !libraryEntry && (
              <Button 
                variant="secondary" 
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </Button>
            )}

            <Link to={`/games/${id}/reviews`}>
              <Button variant="outline">
                Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="game-content">
        <section className="game-section">
          <h2>About</h2>
          <p className="game-summary">
            {game.summary || 'No description available.'}
          </p>
        </section>

        {game.screenshots?.length > 0 && (
          <section className="game-section">
            <h2>Screenshots</h2>
            <div className="screenshots-grid">
              {game.screenshots.map((screenshot, index) => (
                <div key={index} className="screenshot">
                  <img 
                    src={`https:${screenshot.url.replace('t_thumb', 't_screenshot_med')}`} 
                    alt={`${game.name} screenshot ${index + 1}`} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default GameDetail;