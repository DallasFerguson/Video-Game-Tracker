import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useLibrary from '../../hooks/useLibrary';
import useWishlist from '../../hooks/useWishlist';
import GameList from '../../components/games/GameList/GameList';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { library, loading: libraryLoading } = useLibrary();
  const { wishlist, loading: wishlistLoading } = useWishlist();

  //filter games by status for different sections
  const currentlyPlaying = library.filter(game => game.status === 'playing');
  const recentlyAdded = [...library].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)).slice(0, 5);
  const wishlistGames = wishlist.slice(0, 5);

  if (libraryLoading || wishlistLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Currently Playing</h2>
          {currentlyPlaying.length > 0 && (
            <Link to="/library?status=playing" className="view-all">
              View All
            </Link>
          )}
        </div>
        {currentlyPlaying.length > 0 ? (
          <GameList games={currentlyPlaying} />
        ) : (
          <div className="empty-state">
            <p>No games currently in progress</p>
            <Link to="/search" className="action-link">
              Find games to play
            </Link>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recently Added</h2>
          {library.length > 0 && (
            <Link to="/library" className="view-all">
              View All
            </Link>
          )}
        </div>
        {library.length > 0 ? (
          <GameList games={recentlyAdded} />
        ) : (
          <div className="empty-state">
            <p>Your library is empty</p>
            <Link to="/search" className="action-link">
              Add your first game
            </Link>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Wishlist</h2>
          {wishlist.length > 0 && (
            <Link to="/wishlist" className="view-all">
              View All
            </Link>
          )}
        </div>
        {wishlist.length > 0 ? (
          <GameList games={wishlistGames} />
        ) : (
          <div className="empty-state">
            <p>Your wishlist is empty</p>
            <Link to="/search" className="action-link">
              Browse games
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;