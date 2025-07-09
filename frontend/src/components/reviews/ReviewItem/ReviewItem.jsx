// src/components/reviews/ReviewItem/ReviewItem.jsx
import { useState, useContext } from 'react';
import { ReviewContext } from '../../../contexts/ReviewContext';
import RatingDisplay from '../RatingDisplay/RatingDisplay';
import Button from '../../ui/Button/Button';
import './ReviewItem.css';

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const { deleteReview } = useContext(ReviewContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        await deleteReview(review.gameId);
        if (onDelete) onDelete(review.gameId);
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-user">{review.username || 'Me'}</div>
        <div className="review-date">
          {new Date(review.date).toLocaleDateString()}
        </div>
        <RatingDisplay value={review.rating} />
      </div>

      <div className="review-content">{review.review}</div>

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
    </div>
  );
};

export default ReviewItem;