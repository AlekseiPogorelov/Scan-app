import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  buildSearchRequest,
  fetchHistograms,
  fetchDocumentIds,
  fetchDocuments
} from '../../api/api';
import Loader from '../../components/Loader/Loader';
import SummaryCarousel from '../../components/SummaryCarousel/SummaryCarousel';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import Modal from '../../components/Modal/Modal';
import styles from './Results.module.css';


const PAGE_SIZE = 4;

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state;

  const accessToken = localStorage.getItem('accessToken');

  const [summary, setSummary] = useState([]);
  const [histLoading, setHistLoading] = useState(true);
  const [histError, setHistError] = useState('');
  const [docIds, setDocIds] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState('');
  const [page, setPage] = useState(1);
  const [modalDoc, setModalDoc] = useState(null);


  useEffect(() => {
    if (!form) {
      navigate('/search');
      return;
    }
    async function loadHistograms() {
      setHistLoading(true);
      setHistError('');
      try {
        const params = buildSearchRequest(form);
        const data = await fetchHistograms(params, accessToken);
        // Формируем массив периодов для SummaryCarousel
        const periods = [];
        const totalDocs = data.data.find(d => d.histogramType === 'totalDocuments')?.data || [];
        const risks = data.data.find(d => d.histogramType === 'riskFactors')?.data || [];
        totalDocs.forEach((item, i) => {
          periods.push({
            date: item.date.slice(0, 10),
            total: item.value,
            risks: risks[i]?.value || 0,
          });
        });
        setSummary(periods);
      } catch (e) {
        setHistError(e.message || 'Ошибка загрузки сводки');
      } finally {
        setHistLoading(false);
      }
    }
    loadHistograms();
  }, [form, accessToken, navigate]);

  // Получение списка ID публикаций
  useEffect(() => {
    if (!form) return;
    async function loadDocIds() {
      setDocsError('');
      setDocIds([]);
      setDocuments([]);
      setPage(1);
      try {
        const params = buildSearchRequest(form);
        const ids = await fetchDocumentIds(params, accessToken);
        setDocIds(ids);
      } catch (e) {
        setDocsError(e.message || 'Ошибка загрузки документов');
      }
    }
    loadDocIds();
  }, [form, accessToken]);


  useEffect(() => {
    if (!docIds.length) return;
    async function loadDocs() {
      setDocsLoading(true);
      setDocsError('');
      try {
        const nextIds = docIds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        if (!nextIds.length) return;
        const docs = await fetchDocuments(nextIds, accessToken);
        setDocuments(prev => [...prev, ...docs]);
      } catch (e) {
        setDocsError(e.message || 'Ошибка загрузки содержимого документов');
      } finally {
        setDocsLoading(false);
      }
    }
    loadDocs();
  }, [docIds, page, accessToken]);


  const hasMore = useMemo(() => {
    return documents.length < docIds.length;
  }, [documents, docIds]);

  function handleShowMore() {
    setPage(p => p + 1);
  }

  function handleRetry() {
    setHistError('');
    setDocsError('');
    setPage(1);
    setDocuments([]);
    setDocIds([]);
    setSummary([]);
    window.location.reload();
  }

  if (!form) return null;

  return (
    <main className={styles.main}>
      {/* Блок ожидания */}
      <div className={styles.waitBlock}>
        <div>
          <div className={styles.title}>Ищем. Скоро <br />будут результаты</div>
          <div className={styles.subtitle}>
            Поиск может занять некоторое время, <br />просим сохранять терпение.
          </div>
        </div>
        <img
          src={require('../../assets/img/target_2.svg').default}
          alt=""
          className={styles.waitImg}
        />
      </div>

      {/* Общая сводка */}
      <section className={styles.summarySection}>
        <div className={styles.sectionTitle}>Общая сводка</div>
        {histLoading ? (
          <Loader />
        ) : histError ? (
          <div className={styles.error}>
            {histError}
            <button className={styles.retryBtn} onClick={handleRetry}>Повторить</button>
          </div>
        ) : summary.length === 0 ? (
          <div className={styles.emptyState}>По вашему запросу ничего не найдено.</div>
        ) : (
          <SummaryCarousel data={summary} />
        )}
      </section>

      {/* Список документов */}
      <section className={styles.docsSection}>
        <div className={styles.sectionTitle}>Список документов</div>
        {docsError ? (
          <div className={styles.error}>
            {docsError}
            <button className={styles.retryBtn} onClick={handleRetry}>Повторить</button>
          </div>
        ) : docsLoading && documents.length === 0 ? (
          <Loader />
        ) : documents.length === 0 ? (
          <div className={styles.emptyState}>По вашему запросу ничего не найдено.</div>
        ) : (
          <>
            <div className={styles.docsGrid}>
              {documents.map((doc, idx) =>
                doc && (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onClick={() => setModalDoc(doc)}
                  />
                )
              )}
            </div>
            {hasMore && (
              <button
                className={styles.showMoreBtn}
                onClick={handleShowMore}
                disabled={docsLoading}
              >
                {docsLoading ? 'Загрузка...' : 'Показать больше'}
              </button>
            )}
          </>
        )}
      </section>
      {/* Модальное окно для полной статьи */}
      <Modal open={!!modalDoc} onClose={() => setModalDoc(null)}>
        {modalDoc && (
          <DocumentCard doc={modalDoc} full />
        )}
      </Modal>
    </main>
  );
};

export default Results;
