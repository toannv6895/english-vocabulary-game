import PropTypes from 'prop-types';

const Card = ({ item, isEnglish, onClick, isSelected, isMatched }) => {
  // Determine which content to show based on language flag
  const content = isEnglish ? item.english : item.vietnamese;

  const handleClick = () => {
    if (!isMatched) {
      onClick();
    }
  };

  return (
    <div
      className={`card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''} ${isEnglish ? 'english' : 'vietnamese'}`}
      onClick={handleClick}
    >
      <div className="card-content">
        {isMatched && <img src={item.image} alt={content} className="card-image" />}
        <div className="card-text">{content}</div>
        <div className="card-language">{isEnglish ? 'EN' : 'VN'}</div>
      </div>
    </div>
  );
};

Card.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    english: PropTypes.string.isRequired,
    vietnamese: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  isEnglish: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isMatched: PropTypes.bool.isRequired
};

export default Card;
