import React from 'react';
import styles from './TariffCard.module.css';
import CheckIcon from '../../assets/icons/chek.svg';

const TariffCard = ({
  id,
  title,
  description,
  price,
  oldPrice,
  monthly,
  features,
  color,
  icon,
  isCurrent
}) => {
  const isBusiness = id === 'business';

  return (
    <div
      className={`${styles.tariffCard} ${isCurrent ? styles.current : ''}`}
      style={isCurrent ? { '--tariff-color': color } : {}}
    >
      <div className={`${styles.header} ${isBusiness ? styles.headerBusiness : ''}`} style={{ background: color }}>
        <div>
          <h3 className={`${styles.cardTitle} ${isBusiness ? styles.whiteText : ''}`}>{title}</h3>
          <p className={`${styles.cardDesc} ${isBusiness ? styles.whiteText : ''}`}>{description}</p>
        </div>
        {icon && <img src={icon} alt="" className={styles.icon} />}
        {isCurrent && (
          <span className={styles.badge}>Текущий тариф</span>
        )}
      </div>
      <div className={styles.body}>
        <div>
          <div className={styles.priceRow}>
            <span className={styles.price}>{price.toLocaleString()} ₽</span>
            <span className={styles.oldPrice}>{oldPrice.toLocaleString()} ₽</span>
            {isCurrent && <span className={styles.badge}>Текущий тариф</span>}
          </div>
          {monthly && (
            <div className={styles.monthly}>
              или {monthly} ₽/мес. при рассрочке на 24 мес.
            </div>
          )}
        </div>
        <div className={styles.flexGrow} />
        <div className={styles.featuresBlock}>
          <div className={styles.featuresTitle}>В тариф входит:</div>
          <ul className={styles.features}>
            {features.map(f => (
              <li key={f}>
                <img src={CheckIcon} alt="" className={styles.check} />
                {f}
              </li>
            ))}
          </ul>
        </div>
        {isCurrent ? (
          <button className={styles.cabinetBtn} disabled>
            Перейти в личный кабинет
          </button>
        ) : (
          <button className={styles.moreBtn}>
            Подробнее
          </button>
        )}
      </div>
    </div>
  );
};

export default TariffCard;
