import React from 'react';
import styles from './Footer.module.css';
import Logo from '../../assets/logo/logo_footer.svg';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.logoWrap}>
        <img src={Logo} alt="СКАН" className={styles.logo} />
      </div>
      <div className={styles.addressBlock}>
        <div className={styles.address}>г. Москва, Цветной б-р, 40</div>
        <div className={styles.address}>+7 495 771 21 11</div>
        <div className={styles.address}>info@scan.ru</div>
        <div className={styles.copyright}>Copyright © 2022</div>
      </div>
    </div>
  </footer>
);

export default Footer;
