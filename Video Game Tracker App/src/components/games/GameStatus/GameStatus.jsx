import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { updateLibraryEntry } from '../../../api/library';
import Button from '../../ui/Button/Button';
import './GameStatus.css';

const STATUS_OPTIONS = [
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'plan_to_play', label: 'Plan to Play' }
];

const GameStatus = ({ gameId, initialStatus, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateLibraryEntry(user.token, gameId, { status: newStatus });
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