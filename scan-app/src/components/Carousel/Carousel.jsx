import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.css';
import icon1 from '../../assets/icons/speed.svg';
import icon2 from '../../assets/icons/search.svg';
import icon3 from '../../assets/icons/protect.svg';


const features = [
  {
    icon: icon1,
    title: 'Высокая и оперативная скорость обработки заявки',
  },
  {
    icon: icon2,
    title: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос',
  },
  {
    icon: icon3,
    title: 'Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству',
  },
  {
    icon: icon3,
    title: 'Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству',
  },
  {
    icon: icon1,
    title: 'Высокая и оперативная скорость обработки заявки',
  },
  {
    icon: icon2,
    title: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос',
  },
];


const Carousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
  function handleResize() {
    setVisibleCards(window.innerWidth <= 768 ? 1 : 3);
  }
  handleResize();
    window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prev = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? features.length - visibleCards : prevIndex - 1
    );
  };
  const next = () => {
    setStartIndex((prevIndex) =>
      prevIndex + visibleCards >= features.length ? 0 : prevIndex + 1
    );
  };

  const visibleFeatures = [];
  for (let i = 0; i < visibleCards; i++) {
    visibleFeatures.push(features[(startIndex + i) % features.length]);
  }

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.arrow} onClick={prev} aria-label="Назад">
        <svg width="24" height="24" fill="none"><path d="M15 18L9 12L15 6" stroke="#5970FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className={styles.cardsContainer}>
        {visibleFeatures.map((feature, idx) => (
          <div className={styles.card} key={idx}>
            <img src={feature.icon} alt="" className={styles.cardIcon} />
            <p className={styles.cardText}>{feature.title}</p>
          </div>
        ))}
      </div>
      <button className={styles.arrow} onClick={next} aria-label="Вперёд">
        <svg width="24" height="24" fill="none"><path d="M9 18L15 12L9 6" stroke="#5970FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
};

export default Carousel;