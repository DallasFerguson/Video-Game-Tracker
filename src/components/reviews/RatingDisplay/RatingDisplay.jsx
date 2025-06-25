import './RatingDisplay.css';

const RatingDisplay = ({ value }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="rating-display" aria-label={`Rating: ${value} out of 10`}>
      {Array(fullStars).fill().map((_, i) => (
        <span key={`full-${i}`} className="rating-star full">★</span>
      ))}
      
      {hasHalfStar && (
        <span className="rating-star half">★</span>
      )}
      
      {Array(emptyStars).fill().map((_, i) => (
        <span key={`empty-${i}`} className="rating-star empty">★</span>
      ))}
      
      <span className="rating-value">{value.toFixed(1)}</span>
    </div>
  );
};

export default RatingDisplay;