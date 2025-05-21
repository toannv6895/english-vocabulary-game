import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const GameBoard = ({ vocabularyList }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [score, setScore] = useState(0);
  const pairsPerBatch = 5;

  // Prepare cards for the game
  useEffect(() => {
    if (vocabularyList.length === 0) return;

    prepareNextBatch();
  }, [vocabularyList]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const prepareNextBatch = () => {
    const startIndex = currentBatch * pairsPerBatch;
    const endIndex = Math.min(startIndex + pairsPerBatch, vocabularyList.length);

    if (startIndex >= vocabularyList.length) {
      setGameCompleted(true);
      return;
    }

    const currentVocabularyBatch = vocabularyList.slice(startIndex, endIndex);

    // Create pairs of cards (English and Vietnamese)
    const cardPairs = currentVocabularyBatch.flatMap(item => [
      { ...item, isEnglish: true, pairId: item.id },
      { ...item, isEnglish: false, pairId: item.id }
    ]);

    // Shuffle the cards
    const shuffledCards = shuffleArray(cardPairs);

    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setErrorMessage('');
  };

  const handleCardClick = (index) => {
    // Ignore if the card is already matched
    if (matchedPairs.some(pair => pair.includes(index))) {
      return;
    }

    // Clear error message when selecting a new card
    setErrorMessage('');

    // If already selected, deselect it
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter(cardIndex => cardIndex !== index));
      return;
    }

    // Select the card
    const newSelectedCards = [...selectedCards, index];
    setSelectedCards(newSelectedCards);

    // Check if we have selected two cards
    if (newSelectedCards.length === 2) {
      const [firstIndex, secondIndex] = newSelectedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      // Check if one card is English and the other is Vietnamese
      if (firstCard.isEnglish === secondCard.isEnglish) {
        setErrorMessage('Vui lòng chọn một từ tiếng Anh và một từ tiếng Việt!');
        // Reset selection after a delay
        setTimeout(() => {
          setSelectedCards([]);
        }, 1500);
        return;
      }

      // Check if the cards form a pair
      if (firstCard.pairId === secondCard.pairId) {
        // It's a match!
        setMatchedPairs([...matchedPairs, [firstIndex, secondIndex]]);
        setSelectedCards([]);
        setScore(score + 10);
      } else {
        // Not a match
        setErrorMessage('Không đúng! Hãy thử lại.');
        setScore(Math.max(0, score - 2)); // Subtract points for wrong answer, but not below 0
        // Reset selection after a delay
        setTimeout(() => {
          setSelectedCards([]);
        }, 1500);
      }
    }
  };

  // Check if all pairs in the current batch are matched
  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === pairsPerBatch) {
      // All pairs are matched, prepare for the next batch
      setTimeout(() => {
        setCurrentBatch(currentBatch + 1);
        prepareNextBatch();
      }, 1500);
    }
  }, [matchedPairs, cards]);

  const handleNextBatch = () => {
    setCurrentBatch(currentBatch + 1);
    prepareNextBatch();
  };

  const handleRestartGame = () => {
    setCurrentBatch(0);
    setGameCompleted(false);
    setScore(0);
    prepareNextBatch();
  };

  return (
    <div className="game-board">
      {gameCompleted ? (
        <div className="game-completed">
          <h2>Chúc mừng! Bạn đã hoàn thành trò chơi</h2>
          <p className="final-score">Điểm số cuối cùng: {score}</p>
          <button className="restart-button" onClick={handleRestartGame}>
            Chơi lại
          </button>
        </div>
      ) : (
        <>
          <div className="game-info">
            <div className="batch-info">
              Bộ từ vựng: {currentBatch + 1} / {Math.ceil(vocabularyList.length / pairsPerBatch)}
            </div>
            <div className="score-info">
              Điểm: {score}
            </div>
          </div>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <div className="cards-container">
            {cards.map((card, index) => (
              <Card
                key={`${card.pairId}-${card.isEnglish ? 'en' : 'vi'}`}
                item={card}
                isEnglish={card.isEnglish}
                onClick={() => handleCardClick(index)}
                isSelected={selectedCards.includes(index)}
                isMatched={matchedPairs.some(pair => pair.includes(index))}
              />
            ))}
          </div>

          {matchedPairs.length === pairsPerBatch && (
            <button className="next-button" onClick={handleNextBatch}>
              Tiếp theo
            </button>
          )}
        </>
      )}
    </div>
  );
};

GameBoard.propTypes = {
  vocabularyList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      english: PropTypes.string.isRequired,
      vietnamese: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired
    })
  ).isRequired
};

export default GameBoard;
