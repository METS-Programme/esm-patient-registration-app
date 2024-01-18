import React from 'react';
import styles from './fingerprint-capture.scss';
import thumb96 from '../../../../assets/thumb-96.png';

interface ThumbPrintProps {
  data: string;
  onClick: (clickedData: string) => void;
  isActive: boolean;
}

const ThumbPrint: React.FC<ThumbPrintProps> = ({ data, onClick, isActive }) => (
  <div className={`${styles.centeredContainer} ${isActive ? styles.activeThumb : ''}`} onClick={() => onClick(data)}>
    <img src={thumb96} alt={'photo'} className={styles.centeredImage} />
    {data && <p className={styles.centeredText}>Scan {data}</p>}
  </div>
);

export default ThumbPrint;
