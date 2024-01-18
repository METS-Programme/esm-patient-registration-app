/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import styles from './fingerprint-capture.scss';
import thumb96 from '../../../../assets/thumb.png';

interface ThumbPrintProps {
  data: string;
  onClick: (clickedData: string) => void;
  isActive: boolean;
}

const ThumbPrint: React.FC<ThumbPrintProps> = ({ data, onClick, isActive }) => (
  <div className={`${styles.centeredContainer} ${isActive ? styles.activeThumb : ''}`} onClick={() => onClick(data)}>
    <img src={thumb96} alt={'thumb'} className={styles.centeredImage} />
    {data && <p className={styles.centeredText}>Scan {data}</p>}
  </div>
);

export default ThumbPrint;
