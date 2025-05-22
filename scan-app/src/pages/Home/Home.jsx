import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Carousel from '../../components/Carousel/Carousel';
import TariffCard from '../../components/TariffCard/TariffCard';
import styles from './Home.module.css';
import MainIllustration from '../../assets/img/main.svg';
import SunIcon from '../../assets/icons/a_lamp.svg';
import TargetIcon from '../../assets/icons/a_raw.svg';
import BriefcaseIcon from '../../assets/icons/a_note.svg';
import HeroBottom from '../../assets/img/main_body.svg';


const utpList = [
  {
    icon: '/icons/speed.svg',
    title: 'Высокая и оперативная скорость обработки заявки',
  },
  {
    icon: '/icons/search.svg',
    title: 'Огромный комплексный база данных, обеспечивающая объективный ответ на запрос',
  },
  {
    icon: '/icons/protect.svg',
    title: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству',
  },
];

const tariffs = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Для небольшого исследования',
    price: 799,
    oldPrice: 1200,
    monthly: 150,
    features: [
      'Безлимитная история запросов',
      'Безопасная сделка',
      'Поддержка 24/7'
    ],
    color: '#FFB64F',
    icon: SunIcon,
    isCurrent: true,
  },
  {
    id: 'pro',
    title: 'Pro',
    description: 'Для HR и фрилансеров',
    price: 1299,
    oldPrice: 2600,
    monthly: 279,
    features: [
      'Все пункты тарифа Beginner',
      'Экспорт истории',
      'Рекомендации по приоритетам'
    ],
    color: '#7CE3E1',
    icon: TargetIcon,
    isCurrent: false,
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Для корпоративных клиентов',
    price: 2379,
    oldPrice: 3700,
    features: [
      'Все пункты тарифа Pro',
      'Безлимитное количество запросов',
      'Приоритетная поддержка'
    ],
    color: '#000',
    icon: BriefcaseIcon,
    isCurrent: false,
  }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.sectionTitle}>Сервис по поиску <br />
          публикаций <br />
          о компании <br />
          по его ИНН</h1>
          <p className={styles.subtitle}>Комплексный анализ публикаций, получение данных <br />
          в формате PDF на электронную почту.</p>

            <button
              className={styles.ctaBtn}
              disabled={!user}
              onClick={() => user && navigate('/search')}
            >
              Запросить данные
            </button>

        </div>
        <img src={MainIllustration} alt="" className={styles.heroImg} />
      </section>
      <section className={styles.utpSection}>
         <h2 className={styles.utpBlock}>Почему именно мы</h2>
         <div className={styles.carouselMobileOneSlide}>
            <Carousel items={utpList} />
            </div>
      </section>
      <section className={styles.middleImage}>
        <img src={HeroBottom} alt="" className={styles.bottomImg} />
      </section>
      <section className={styles.tariffsSection}>
        <h2 className={styles.sectionTitle}>Наши тарифы</h2>
        <div className={styles.tariffsGrid}>
             {tariffs.map(tariff => (
                <TariffCard
                key={tariff.id}
                 {...tariff}
                    isCurrent={user?.tariff === tariff.id}
                />
             ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
