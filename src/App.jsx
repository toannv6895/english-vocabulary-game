import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import vocabularyData from './data/vocabulary.json';
import './App.css';

function App() {
  const [vocabularyList, setVocabularyList] = useState([]);

  useEffect(() => {
    // Load vocabulary data
    setVocabularyList(vocabularyData.vocabularyList);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Học Từ Vựng Tiếng Anh</h1>
        <p>Ghép cặp từ tiếng Anh và tiếng Việt tương ứng</p>
      </header>
      <main className="app-main">
        {vocabularyList.length > 0 ? (
          <GameBoard vocabularyList={vocabularyList} />
        ) : (
          <div className="loading">Đang tải dữ liệu...</div>
        )}
      </main>
      <footer className="app-footer">
        <p>Ứng dụng học từ vựng tiếng Anh - Ghép cặp từ vựng</p>
      </footer>
    </div>
  );
}

export default App;
