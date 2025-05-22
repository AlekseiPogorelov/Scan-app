import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
