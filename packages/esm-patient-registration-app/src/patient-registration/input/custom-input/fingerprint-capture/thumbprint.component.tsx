import React from 'react';
import styles from './fingerprint-capture.scss'; // Import your component-specific styles

const ThumbPrint = ({ data }) => {
  return (
    <div className={styles.centeredContainer}>
      <img src={data.imageUrl} alt={data.altText} className={styles.centeredImage} />
      <p className={styles.centeredText}>{data}</p>
    </div>
  );
};

export default ThumbPrint;
