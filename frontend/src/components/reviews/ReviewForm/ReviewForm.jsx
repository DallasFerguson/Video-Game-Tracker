import { useState, useContext } from 'react';
import { ReviewContext } from '../../../contexts/ReviewContext';
import Button from '../../ui/Button/Button';
import RatingInput from '../RatingInput/RatingInput';
import './ReviewForm.css';

const ReviewForm = ({ gameId, initialReview = null, onSuccess, onCancel }) => {
  const { addReview } = useContext(ReviewContext);
  const [review, setReview] = useState({
    rating: initialReview?.rating || 5,
    content: initialReview?.review || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Use the context function instead of direct API call
      await addReview(gameId, {
        rating: review.rating,
        content: review.content
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setReview({ ...review, rating: newRating });
  };

  const handleContentChange = (e) => {
    setReview({ ...review, content: e.target.value });
  };

  return (
    <div className="review-form">
      <h3>{initialReview ? 'Edit Your Review' : 'Write a Review'}</h3>
      
      {error && <div className="review-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Rating</label>
          <RatingInput 
            value={review.rating} 
            onChange={handleRatingChange} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="review-content">Review</label>
          <textarea
            id="review-content"
            value={review.content}
            onChange={handleContentChange}
            rows="5"
            required
            minLength="10"
            maxLength="1000"
          />
        </div>

        <div className="review-form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          {onCancel && (
            <Button 
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;