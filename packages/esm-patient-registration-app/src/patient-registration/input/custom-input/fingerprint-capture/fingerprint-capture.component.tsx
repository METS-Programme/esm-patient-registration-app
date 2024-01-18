import React from 'react';
import Overlay from '../../../ui-components/overlay';
import { useTranslation } from 'react-i18next';
import { isDesktop, useLayoutType } from '@openmrs/esm-framework';
import { Button, ButtonSet, Checkbox, Search, RadioButtonGroup, RadioButton } from '@carbon/react';
import styles from './fingerprint-capture.scss';
import ThumbPrint from './thumbprint.component';

interface FingerPrintCaptureOverlay {
  closeOverlay: () => void;
}

export const FingerPrintCapture: React.FC<FingerPrintCaptureOverlay> = ({ closeOverlay }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();

  // save fingerPrints
  const handleSubmittingFingerPrints = () => {
    console.info('Successfully submitted fingerPrint');
  };

  const thumbsList = [
    'Scan Right Thumb',
    'Scan Right Index',
    'Scan Left  Thumb',
    'Scan Left  Index',
    'Scan Right Middle',
    'Scan Left Middle',
  ];

  return (
    <Overlay
      close={closeOverlay}
      header={t('addFingerPrint', 'Add Patient Fingerprints')}
      buttonsGroup={
        <ButtonSet className={isDesktop(layout) ? styles.desktop : styles.tablet}>
          <Button className={styles.button} kind="secondary" onClick={closeOverlay}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button className={styles.button} kind="primary" onClick={handleSubmittingFingerPrints}>
            {t('saveFingerPrints', 'Save FingerPrints ')}
          </Button>
        </ButtonSet>
      }>
      <div>
        <section className={styles.section}>
          <h4>Select and scan fingerprint of the patient</h4>
        </section>

        <section className={styles.section}>
          <div className={styles.gridContainer}>
            {thumbsList.map((element, index) => (
              <ThumbPrint key={index} data={element} />
            ))}
          </div>
        </section>

        <section className={styles.section}></section>
      </div>
    </Overlay>
  );
};
