import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader/Loader';
import { ReactComponent as Logo } from '../../assets/logo/logo_header.svg';
import styles from './Header.module.css';
import avatarPng from '../../assets/foto.jpg';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/tariffs', label: 'Тарифы' },
  { to: '/faq', label: 'FAQ' },
];

const Header = () => {
  const { user, logout, limits, fetchLimits } = useAuth();
  const [loadingLimits, setLoadingLimits] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(user?.avatar || avatarPng);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setAvatarSrc(user?.avatar || avatarPng);
  }, [user]);

  useEffect(() => {
    let ignore = false;
    if (user && !limits && !loadingLimits) {
      setLoadingLimits(true);
      fetchLimits().finally(() => {
        if (!ignore) setLoadingLimits(false);
      });
    }
    return () => { ignore = true; };
  }, [user, limits, fetchLimits, loadingLimits]);

  const renderAvatar = () => {
    if (avatarSrc) {
      return (
        <img
          src={avatarSrc}
          alt="avatar"
          className={styles.avatarImg}
          onError={() => {
            if (avatarSrc !== avatarPng) {
              setAvatarSrc(avatarPng);
            } else {
              setAvatarSrc(null);
            }
          }}
        />
      );
    }
    return (
      <div className={styles.avatarFallback}>
        {user?.name?.[0]?.toUpperCase() || 'U'}
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
        <button
          className={styles.burger}
          aria-label="Открыть меню"
          onClick={() => setMobileMenuOpen(v => !v)}
        >
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
        </button>
        {/* Навигация */}
        <nav className={styles.nav}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.navLink}
              style={{
                fontWeight: location.pathname === link.to ? 700 : 500,
                opacity: location.pathname === link.to ? 1 : 0.8,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
          {/* Неавторизован: Зарегистрироваться и Войти */}
          {!user && (
            <div className={styles.authPanel}>
              <button className={styles.registerBtn}>Зарегистрироваться</button>
              <span className={styles.divider}>|</span>
              <Link to="/login" className={styles.loginBtn}>Войти</Link>
            </div>
          )}

          {/* Авторизован: лимиты, имя, аватар, Выйти */}
          {user && (
            <>
              <div className={styles.limitsPanel}>
                  <div className={styles.limitRow}>
            <span className={styles.limitLabel}>Использовано компаний</span>
            <span className={styles.limitValue}>{limits?.used ?? <Loader size={16} />}</span>
            </div>
            <div className={styles.limitRow}>
            <span className={styles.limitLabel}>Лимит по компаниям</span>
            <span className={styles.limitValueGreen}>{limits?.total ?? <Loader size={16} />}</span>
              </div>
              </div>
              <div className={styles.userPanel}>
                    <div className={styles.userInfoColumn}>
                        <span className={styles.userName}>{user.name}</span>
                        <button onClick={logout} className={styles.logoutButton}>Выйти</button>
                    </div>
                    <div className={styles.avatar}>
                  {renderAvatar()}
                </div>

              </div>
              {mobileMenuOpen && (
      <nav className={styles.mobileNav}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={styles.navLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    )}
            </>
          )}

      </div>
    </header>
  );
};

export default Header;
