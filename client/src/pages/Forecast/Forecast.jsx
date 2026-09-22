import React, { useState } from 'react';
import styles from './Forecast.module.css';

export default function Forecast() {
  const [selectedCard, setSelectedCard] = useState(null);

  const drawCard = () => {
    const cards = [
      { name: "The Magician", meaning: "Manifestation, resourcefulness, power, inspired action." },
      { name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine, the subconscious mind." },
      { name: "The Empress", meaning: "Femininity, beauty, nature, nurturing, abundance." },
      { name: "The Star", meaning: "Hope, faith, purpose, renewal, spirituality." }
    ];
    setSelectedCard(cards[Math.floor(Math.random() * cards.length)]);
  };

  return (
    <div className={styles.mysticalContainer}>
      <div className={styles.selectionContainer}>
        <h1 className={styles.oracleTitle}>The Cards of Fate</h1>
        <p className={styles.oracleSubtitle}>Draw your cosmic guidance card for today.</p>

        <div style={{ textAlign: 'center' }}>
          <button className={styles.btnSelectMode} onClick={drawCard}>
            {selectedCard ? "Draw Another Card" : "Draw One Card"}
          </button>
        </div>

        {selectedCard && (
          <div className={styles.readingOptionCard} style={{ margin: '30px auto' }}>
            <div className={styles.optionIcon}>🔮</div>
            <h2 className={styles.optionTitle}>{selectedCard.name}</h2>
            <p className={styles.optionDesc}>{selectedCard.meaning}</p>
          </div>
        )}
      </div>
    </div>
  );
}