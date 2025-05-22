import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Search.module.css';
import RocketSVG from '../../assets/img/search_3.svg';
import FolderSVG from '../../assets/img/Folders.svg';
import FileSVG from '../../assets/img/Document.svg';
import { validateInn } from '../../validateINN/data-validation';


const TONALITIES = [
  { value: 'any', label: 'Любая' },
  { value: 'positive', label: 'Позитивная' },
  { value: 'negative', label: 'Негативная' },
];

const today = new Date().toISOString().slice(0, 10);

const Search = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    inn: '',
    tonality: 'any',
    limit: '',
    dateStart: '',
    dateEnd: '',
    maxCompleteness: false,
    businessContext: false,
    mainRole: false,
    onlyWithRiskFactors: false,
    includeTechNews: false,
    includeAnnouncements: false,
    includeDigests: false,
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Валидация всех обязательных полей
  function validate(form) {
    const errors = {};
    if (!form.inn) {
        errors.inn = 'Введите ИНН';
    } else {
        const errorObj = {};
    if (!validateInn(form.inn, errorObj)) {
      errors.inn = errorObj.message || 'Неверный формат ИНН';
      }
    }
    if (!form.tonality) errors.tonality = 'Выберите тональность';
    if (!form.limit) errors.limit = 'Укажите количество документов';
    else if (+form.limit < 1 || +form.limit > 1000) errors.limit = 'От 1 до 1000';
    if (!form.dateStart) errors.dateStart = 'Укажите дату начала';
    if (!form.dateEnd) errors.dateEnd = 'Укажите дату конца';
    else {
      if (form.dateStart && form.dateStart > today) errors.dateStart = 'Дата не может быть в будущем';
      if (form.dateEnd && form.dateEnd > today) errors.dateEnd = 'Дата не может быть в будущем';
      if (form.dateStart && form.dateEnd && form.dateStart > form.dateEnd) {
        errors.dateStart = 'Дата начала позже даты конца';
        errors.dateEnd = 'Дата конца раньше даты начала';
      }
    }
    return errors;
  }

  // Проверка валидности всей формы
  const formErrors = validate(form);
  const isFormValid = Object.keys(formErrors).length === 0;

  // Обработчики
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }
  function handleBlur(e) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      inn: true,
      tonality: true,
      limit: true,
      dateStart: true,
      dateEnd: true,
    });
    if (!isFormValid) return;
    // отправка запроса и переход к результатам
    navigate('/results', { state: { ...form } });
  }

  return (
     <div className={styles.searchContent}>
    <div className={styles.searchLeft}>
      <h1 className={styles.title}>Найдите необходимые данные в пару кликов.</h1>
      <p className={styles.subtitle}>
        Задайте параметры поиска.<br />
        Чем больше заполните, тем точнее поиск.
      </p>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formGrid}>
            <div className={styles.leftFields}>
              {/* ИНН */}
              <label className={styles.label}>
                ИНН компании *
                <input
                  className={`${styles.input} ${touched.inn && errors.inn ? styles.inputError : ''}`}
                  name="inn"
                  value={form.inn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={12}
                  placeholder="10 или 12 цифр"
                  autoComplete="off"
                  required
                />
                {touched.inn && errors.inn && <span className={styles.error}>{errors.inn}</span>}
              </label>
              {/* Тональность */}
              <label className={styles.label}>
                Тональность
                <select
                  className={styles.input}
                  name="tonality"
                  value={form.tonality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  {TONALITIES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>
              {/* Количество документов */}
              <label className={styles.label}>
                Количество документов в выдаче *
                <input
                  className={`${styles.input} ${touched.limit && errors.limit ? styles.inputError : ''}`}
                  name="limit"
                  type="number"
                  min="1"
                  max="1000"
                  value={form.limit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="От 1 до 1000"
                  required
                />
                {touched.limit && errors.limit && <span className={styles.error}>{errors.limit}</span>}
              </label>
              {/* Диапазон дат */}
              <label className={styles.label}>
                Диапазон поиска *
                <div className={styles.datesRow}>
                  <input
                    className={`${styles.input} ${touched.dateStart && errors.dateStart ? styles.inputError : ''}`}
                    name="dateStart"
                    type="date"
                    value={form.dateStart}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    max={today}
                    required
                  />
                  <input
                    className={`${styles.input} ${touched.dateEnd && errors.dateEnd ? styles.inputError : ''}`}
                    name="dateEnd"
                    type="date"
                    value={form.dateEnd}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    max={today}
                    required
                  />
                </div>
                {(touched.dateStart && errors.dateStart) && <span className={styles.error}>{errors.dateStart}</span>}
                {(touched.dateEnd && errors.dateEnd) && <span className={styles.error}>{errors.dateEnd}</span>}
              </label>
            </div>
            <div className={styles.rightFields}>
              {/* Чекбоксы */}
              <label className={styles.checkbox}>
                <input type="checkbox" name="maxCompleteness" checked={form.maxCompleteness} onChange={handleChange} />
                Признак максимальной полноты
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" name="businessContext" checked={form.businessContext} onChange={handleChange} />
                Упоминания в бизнес-контексте
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" name="mainRole" checked={form.mainRole} onChange={handleChange} />
                Главная роль в публикации
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" name="onlyWithRiskFactors" checked={form.onlyWithRiskFactors} onChange={handleChange} />
                Публикации только с риск-факторами
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" name="includeTechNews" checked={form.includeTechNews} onChange={handleChange} />
                Включать технические новости рынков
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" name="includeAnnouncements" checked={form.includeAnnouncements} onChange={handleChange} />
                Включать анонсы и календари
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" name="includeDigests" checked={form.includeDigests} onChange={handleChange} />
                Включать сводки новостей
              </label>
              <button
                    className={styles.submitBtn}
                    type="submit"
                    disabled={!isFormValid}
                    style={{ marginRight: '40px', marginTop: 105, alignSelf: 'flex-end' }}
              >
              Поиск
              </button>
                <div className={styles.requiredNote}>
                * Обязательные к заполнению поля
                </div>
            </div>
          </div>
        </form>
        </div>
  <div className={styles.searchRight}>
      <div style={{ flexGrow: 1 }} />
    <img src={FileSVG} alt="" className={styles.fileSvg} />
    <img src={FolderSVG} alt="" className={styles.folderSvg} />
    <img src={RocketSVG} alt="" className={styles.rocketSvg} />
  </div>
  <div className={styles.mobileIllustration}>
  <img src={RocketSVG} alt="" className={styles.rocketSvgMobile} />
</div>
</div>

  );
};

export default Search;
