import { useState, useContext } from 'react';
import { LibraryContext } from '../../../contexts/LibraryContext';
import Button from '../../ui/Button/Button';
import './GameStatus.css';

const STATUS_OPTIONS = [
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'plan_to_play', label: 'Plan to Play' }
];

const GameStatus = ({ gameId, initialStatus, onUpdate }) => {
  const { updateInLibrary } = useContext(LibraryContext);
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await updateInLibrary(gameId, { status: newStatus });
      setStatus(newStatus);
      onUpdate?.(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="game-status">
      <div className="game-status-label">Status:</div>
      <div className="game-status-buttons">
        {STATUS_OPTIONS.map(option => (
          <Button
            key={option.value}
            variant={status === option.value ? 'primary' : 'outline'}
            size="small"
            disabled={isUpdating}
            onClick={() => handleStatusChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GameStatus;