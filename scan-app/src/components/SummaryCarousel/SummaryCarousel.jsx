import React, { useState } from 'react';
import styles from './SummaryCarousel.module.css';

const SummaryCarousel = ({ data }) => {
  const [start, setStart] = useState(0);

  if (!Array.isArray(data) || data.length === 0) return null;

  const visibleCount = 7;
  const canScrollLeft = start > 0;
  const canScrollRight = start + visibleCount < data.length;

  return (
    <div className={styles.carouselWrapper}>
      {/* Стрелка влево */}
      <button
        className={styles.arrow}
        onClick={() => setStart(s => Math.max(0, s - 1))}
        disabled={!canScrollLeft}
        aria-label="Прокрутить влево"
      >
        &lt;
      </button>
      <div className={styles.carousel}>
        {/* Количество вариантов найдено */}
        <div className={styles.foundCount}>
          Найдено {data.length} вариантов
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Период</th>
              {data.slice(start, start + visibleCount).map((col, i) => (
                <th key={i}>{col.date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Всего</td>
              {data.slice(start, start + visibleCount).map((col, i) => (
                <td key={i}>{col.total}</td>
              ))}
            </tr>
            <tr>
              <td>Риски</td>
              {data.slice(start, start + visibleCount).map((col, i) => (
                <td key={i}>{col.risks}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {/* Стрелка вправо */}
      <button
        className={styles.arrow}
        onClick={() => setStart(s => Math.min(data.length - visibleCount, s + 1))}
        disabled={!canScrollRight}
        aria-label="Прокрутить вправо"
      >
        &gt;
      </button>
    </div>
  );
};

export default SummaryCarousel;
