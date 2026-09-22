import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Zodiac.module.css';

import fireBackground from '../../images/fire_bg.jpeg';
import waterBackground from '../../images/water_bg.jpeg';
import airBackground from '../../images/air_bg.jpeg';
import earthBackground from '../../images/earth_bg.jpeg';
import vectorFrame from '../../images/vector.png';

const ELEMENTS = ['fire', 'water', 'air', 'earth'];
const ELEMENT_LABEL = { fire: 'Fire Signs', water: 'Water Signs', air: 'Air Signs', earth: 'Earth Signs' };
const ELEMENT_SIGNS = {
  fire: ['aries', 'leo', 'sagittarius'],
  water: ['cancer', 'scorpio', 'pisces'],
  air: ['gemini', 'libra', 'aquarius'],
  earth: ['taurus', 'virgo', 'capricorn']
};
const ELEMENT_BG = { fire: fireBackground, water: waterBackground, air: airBackground, earth: earthBackground };

export default function Zodiac() {
  const [searchParams, setSearchParams] = useSearchParams();
  const elemParam = (searchParams.get('elem') || 'fire').toLowerCase();
  const currentElem = ELEMENTS.includes(elemParam) ? elemParam : 'fire';

  return (
    <div className={styles.zodiacPage} style={{ backgroundImage: `url(${ELEMENT_BG[currentElem]})` }}>
      <div className={styles.pageOverlay}>
        <main className={styles.mainContent}>
          <h2 className={styles.heading}>{ELEMENT_LABEL[currentElem]}</h2>
          <div className={styles.diamondContainer}>
            {ELEMENT_SIGNS[currentElem].map((slug) => (
              <div key={slug} className={styles.diamondWrapper}>
                <div className={styles.signCard}>
                  <img src={vectorFrame} alt="Frame" className={styles.vectorBg} />
                  <span className={styles.signName}>{slug.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            {ELEMENTS.map((el) => (
              <button
                key={el}
                className={styles.cta}
                style={{ opacity: el === currentElem ? 1 : 0.6 }}
                onClick={() => setSearchParams({ elem: el })}
              >
                {el.toUpperCase()}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}