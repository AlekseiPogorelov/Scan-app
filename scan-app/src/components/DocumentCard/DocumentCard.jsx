import React from 'react';
import styles from './DocumentCard.module.css';
import defaultImg from '../../assets/img/target_2.svg';


function extractImage(markup) {
  if (!markup) return null;
  const imgMatch = markup.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  if (imgMatch) return imgMatch[1];
  const sourceMatch = markup.match(/<source[^>]+srcset=['"]([^'"]+)['"]/i);
  if (sourceMatch) {
    const urls = sourceMatch[1].split(',');
    if (urls.length > 0) {
      return urls[0].trim().split(' ')[0];
    }
  }

  const urlMatch = markup.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|webp)/i);
  if (urlMatch) return urlMatch[0];

  return null;
}

function decodeHTMLEntities(str) {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}
function stripHtmlTags(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
}
function cleanArticleText(markup) {
  let decoded = decodeHTMLEntities(markup);
  let text = stripHtmlTags(decoded);
  return text.replace(/\s+/g, ' ').trim();
}

function markupToText(markup) {
  if (!markup) return '';
  let text = markup.replace(/<\/?[^p][^>]*>/gi, '');
  text = text.replace(/<\/p>\s*<p>/gi, '\n').replace(/<p>/gi, '').replace(/<\/p>/gi, '');
  return text.trim();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU');
}

const TAGS = [
  { key: 'isTechNews', label: 'Технические новости', color: '#FFB64F' },
  { key: 'isAnnouncement', label: 'Анонсы и события', color: '#7CE3E1' },
  { key: 'isDigest', label: 'Сводки новостей', color: '#5970FF' },
];

const DocumentCard = ({ doc, onClick, full = false }) => {
  const { issueDate, source, title, content, url, attributes } = doc;
  const imageUrl = extractImage(content?.markup) || defaultImg;
  const wordCount = attributes?.wordCount || 0;
  const text = cleanArticleText(content?.markup);

  // Определяем теги
  const tags = TAGS.filter(tag => attributes && attributes[tag.key]);
  const showDefaultDigest = tags.length === 0;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.date}>{formatDate(issueDate)}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.source}
          onClick={e => e.stopPropagation()}
        >
          {source?.name}
        </a>
      </div>
      <div className={styles.title}>{title?.text}</div>
      <div className={styles.tags}>
        {tags.map(tag => (
         <span key={tag.key} className={styles.tag} style={{ background: tag.color }}>
             {tag.label}
            </span>
         ))}
        {showDefaultDigest && (
         <span className={styles.tag} style={{ background: '#5970FF' }}>
        Сводки новостей
         </span>
        )}
        </div>
      {imageUrl && (
        <div className={styles.imageWrap}>
          <img src={imageUrl} alt="" className={styles.image} />
        </div>
      )}
      <div className={full ? styles.textFull : styles.text}>
        {text.split('\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>
      <div className={styles.footer}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.readBtn}
          onClick={e => e.stopPropagation()}
        >
          Читать в источнике
        </a>
        <span className={styles.wordCount}>{wordCount.toLocaleString('ru-RU')} слова</span>
      </div>
    </div>
  );
};

export default DocumentCard;
