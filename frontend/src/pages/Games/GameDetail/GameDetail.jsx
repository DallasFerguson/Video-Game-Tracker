import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameDetails } from '../../../api/games';
import useLibrary from '../../../hooks/useLibrary';
import useWishlist from '../../../hooks/useWishlist';
import useNotification from '../../../hooks/useNotification';
import GameStatus from '../../../components/games/GameStatus/GameStatus';
import Button from '../../../components/ui/Button/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { library, addToLibrary, updateInLibrary } = useLibrary();
  const { wishlist, addToWishlist } = useWishlist();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const libraryEntry = library.find(item => item.gameId === parseInt(id));
  const isInWishlist = wishlist.some(item => item.gameId === parseInt(id));

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const gameData = await getGameDetails(id);
        setGame(gameData);
      } catch (err) {
        setError(err.message);
        notify('Failed to load game details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id, notify]);

  const handleAddToLibrary = async (status = 'plan_to_play') => {
    try {
      await addToLibrary({
        gameId: game.id,
        name: game.name,
        cover: game.cover.url,
        status,
        rating: 0,
        playtime: 0
      });
      notify('Game added to your library', 'success');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist({
        gameId: game.id,
        name: game.name,
        cover: game.cover.url
      });
      notify('Game added to wishlist', 'success');
    } catch (err) {
      notify(err.message, 'error');
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
          <img 
            src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`} 
            alt={game.name} 
          />
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
                gameId={game.id} 
                initialStatus={libraryEntry.status}
                onUpdate={() => notify('Status updated', 'success')}
              />
            ) : (
              <Button 
                variant="primary" 
                onClick={() => handleAddToLibrary()}
              >
                Add to Library
              </Button>
            )}

            {!isInWishlist && (
              <Button 
                variant="secondary" 
                onClick={handleAddToWishlist}
              >
                Wishlist
              </Button>
            )}
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