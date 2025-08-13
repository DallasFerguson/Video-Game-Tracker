import GameList from '../../../components/games/GameList/GameList';
import './Trending.css';

const Trending = () => {
  return (
    <div className="trending-page">
      <h1>Trending Games</h1>
      <p className="subtitle">What's popular right now</p>
      <GameList mode="trending" />
    </div>
  );
};

export default Trending;
