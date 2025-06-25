import { useState, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { deleteReview } from '../../../api/reviews';
import RatingDisplay from '../RatingDisplay/RatingDisplay';
import Button from '../../ui/Button/Button';
import './ReviewItem.css';

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        await deleteReview(
          localStorage.getItem('token'),
          review.gameId
        );
        onDelete?.(review.gameId);
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const isCurrentUser = user?.id === review.userId;

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-user">{review.username}</div>
        <div className="review-date">
          {new Date(review.date).toLocaleDateString()}
        </div>
        <RatingDisplay value={review.rating} />
      </div>

      <div className="review-content">{review.review}</div>

      {isCurrentUser && (
        <div className="review-actions">
          <Button 
            variant="outline" 
            size="small"
            onClick={() => onEdit(review)}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="small"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;