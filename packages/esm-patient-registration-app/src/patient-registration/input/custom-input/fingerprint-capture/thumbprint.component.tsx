import React from 'react';
import styles from './fingerprint-capture.scss'; // Import your component-specific styles

interface ThumbPrintProps {
  data?: string;
  onClick: () => void;
}

const ThumbPrint = ({ data, onClick }) => (
  <div className={styles.centeredContainer} onClick={onClick && (() => onClick(data))}>
    <img src={data.imageUrl} alt={data.altText} className={styles.centeredImage} />
    {data && <p className={styles.centeredText}>Scan {data}</p>}
  </div>
);

export default ThumbPrint;
