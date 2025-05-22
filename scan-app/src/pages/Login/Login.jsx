import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';
import AuthImage from '../../assets/img/Characters.svg';
import LockImage from '../../assets/icons/lock.svg';
import { ReactComponent as GoogleIcon } from '../../assets/icons/google.svg';
import { ReactComponent as FacebookIcon } from '../../assets/icons/facebook.svg';
import { ReactComponent as YandexIcon } from '../../assets/icons/yandex.svg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const isFormValid = login.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ login, password })
      });
      const data = await response.json();
      if (!response.ok || !data.accessToken) {
        throw new Error(data.message || 'Неверный логин или пароль');
      }
      authLogin({ name: login, avatar: '/assets/avatar.png' }, data.accessToken);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.leftInner}>
            <div className={styles.title}>
              ДЛЯ ОФОРМЛЕНИЯ ПОДПИСКИ<br />НА ТАРИФ, НЕОБХОДИМО<br />АВТОРИЗОВАТЬСЯ.
            </div>
            <img src={AuthImage} alt="" className={styles.illustration} />
          </div>
        </div>
        <div className={styles.right}>

          <div className={styles.formContainer}>
              <img src={LockImage} alt="" className={styles.lock} />
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${styles.activeTab}`}>Войти</button>
              <button className={styles.tab} disabled>Зарегистрироваться</button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit} autoComplete="on">
              <label className={styles.label}>
                Логин или номер телефона:
                <input
                  className={styles.input}
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  required
                />
              </label>
              <label className={styles.label}>
                Пароль:
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </label>
              {error && <div className={styles.error}>{error}</div>}
              <button
                className={styles.submitBtn}
                type="submit"
                disabled={!isFormValid || loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </form>
            <a href="#" className={styles.forgotLink}>Восстановить пароль</a>
            <div className={styles.socials}>
              <span className={styles.socialLabel}>Войти через:</span>
              <div className={styles.socialIcons}>
                <button className={styles.socialBtn} type="button" disabled>
                  <GoogleIcon className={styles.socialIcon} />
                </button>
                <button className={styles.socialBtn} type="button" disabled>
                  <FacebookIcon className={styles.socialIcon} />
                </button>
                <button className={styles.socialBtn} type="button" disabled>
                  <YandexIcon className={styles.socialIcon} />
                </button>
              </div>
            </div>
<div className={styles.mobileIllustration}>
          <img src={AuthImage} alt="" className={styles.illustration} />
        </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>

      </footer>
    </div>
  );
};

export default Login;
