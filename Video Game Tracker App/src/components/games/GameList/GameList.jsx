import { useState, useEffect } from 'react';
import { searchGames, getTrendingGames } from '../../../api/games';
import GameCard from '../GameCard/GameCard';
import './GameList.css';

const GameList = ({ searchQuery, mode = 'search' }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (mode === 'search' && searchQuery) {
          response = await searchGames(searchQuery);
        } else {
          response = await getTrendingGames();
        }
        setGames(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchQuery, mode]);

  if (loading) return <div className="game-list-loading">Loading games...</div>;
  if (error) return <div className="game-list-error">Error: {error}</div>;
  if (games.length === 0) return <div className="game-list-empty">No games found</div>;

  return (
    <div className="game-list">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameList;