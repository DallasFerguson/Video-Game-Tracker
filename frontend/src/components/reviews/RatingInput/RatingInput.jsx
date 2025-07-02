import './RatingInput.css';

const RatingInput = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="rating-input">
      <div className="rating-stars">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            className={`rating-star ${value >= star ? 'filled' : ''}`}
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} out of 10`}
          >
            ★
          </button>
        ))}
      </div>
      <div className="rating-value">{value}/10</div>
    </div>
  );
};

export default RatingInput;