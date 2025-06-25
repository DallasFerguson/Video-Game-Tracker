import { useState } from 'react';
import ReviewItem from '../ReviewItem/ReviewItem';
import ReviewForm from '../ReviewForm/ReviewForm';
import './ReviewList.css';

const ReviewList = ({ reviews, gameId, currentUserReview, onUpdate }) => {
  const [editingReview, setEditingReview] = useState(null);

  const handleReviewSubmit = () => {
    setEditingReview(null);
    onUpdate?.();
  };

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleDelete = () => {
    onUpdate?.();
  };

  return (
    <div className="review-list">
      <h2 className="review-list-title">Reviews</h2>

      {currentUserReview && !editingReview && (
        <div className="current-user-review">
          <h3>Your Review</h3>
          <ReviewItem 
            review={currentUserReview} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {(editingReview || (!currentUserReview && reviews.length > 0)) && (
        <ReviewForm
          gameId={gameId}
          initialReview={editingReview}
          onSuccess={handleReviewSubmit}
        />
      )}

      {reviews
        .filter(review => !currentUserReview || review.userId !== currentUserReview.userId)
        .map(review => (
          <ReviewItem 
            key={`${review.userId}-${review.gameId}`} 
            review={review}
            onDelete={handleDelete}
          />
        ))}

      {reviews.length === 0 && !currentUserReview && (
        <div className="no-reviews">No reviews yet. Be the first to review!</div>
      )}
    </div>
  );
};

export default ReviewList;