import { useState, useContext } from 'react';
import { ReviewContext } from '../../../contexts/ReviewContext';
import ReviewItem from '../ReviewItem/ReviewItem';
import ReviewForm from '../ReviewForm/ReviewForm';
import './ReviewList.css';

const ReviewList = ({ gameId, onUpdate, gameDetails }) => {
  const { reviews, getGameReviews } = useContext(ReviewContext);
  const [editingReview, setEditingReview] = useState(null);
  
  //get all reviews for this game
  const gameReviews = getGameReviews ? getGameReviews(parseInt(gameId)) : [];
  
  //for a personal tracker, there's typically just one review per game (your own)
  const currentUserReview = gameReviews.length > 0 ? gameReviews[0] : null;

  const handleReviewSubmit = () => {
    setEditingReview(null);
    if (onUpdate) onUpdate();
  };

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleDelete = () => {
    if (onUpdate) onUpdate();
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

      {(editingReview || (!currentUserReview && gameReviews.length === 0)) && (
        <ReviewForm
          gameId={gameId}
          initialReview={editingReview}
          gameDetails={gameDetails}
          onSuccess={handleReviewSubmit}
          onCancel={editingReview ? () => setEditingReview(null) : null}
        />
      )}

      {gameReviews
        .filter(review => !currentUserReview || review.id !== currentUserReview.id)
        .map(review => (
          <ReviewItem 
            key={review.id} 
            review={review}
            onDelete={handleDelete}
          />
        ))}

      {gameReviews.length === 0 && !currentUserReview && (
        <div className="no-reviews">No reviews yet. Be the first to review!</div>
      )}
    </div>
  );
};

export default ReviewList;