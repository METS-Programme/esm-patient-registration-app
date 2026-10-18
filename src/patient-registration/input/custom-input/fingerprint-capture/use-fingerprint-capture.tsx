import React, { useState } from 'react';
import { Button, ButtonSet } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { isDesktop, useLayoutType } from '@openmrs/esm-framework';
import ThumbPrint from './thumbprint.component';
import styles from './fingerprint-capture.scss';

const thumbsList = ['Right Thumb', 'Right Index', 'Left Thumb', 'Left Index', 'Right Middle', 'Left Middle'];

/**
 * Shared fingerprint selection logic for the classic overlay and the docked
 * workspace panel (see workspace-fingerprint-panel.component.tsx).
 */
export function useFingerprintCapture(closeOverlay: () => void) {
  const { t } = useTranslation();
  const layout = useLayoutType();

  const [clickedData, setClickedData] = useState<string | undefined>();

  const handleThumbClick = (data: string) => setClickedData(data);

  // save fingerPrints
  const handleSubmittingFingerPrints = () => {
    if (clickedData) {
      // TODO: this component is a UI stub — wire up a real biometric capture
      // integration (device SDK / backend endpoint) before enabling
      // enableFingerprintCapture in production.
      // eslint-disable-next-line no-console
      console.info(`Successfully submitted fingerPrint: ${clickedData}`);
      // Clear the clicked data after processing if needed
      setClickedData(undefined);
    }
  };

  const body = (
    <div>
      <section className={styles.section}>
        <h4>Select and scan fingerprint of the patient</h4>
      </section>

      <section className={styles.section}>
        <div className={styles.gridContainer}>
          {thumbsList.map((element, index) => (
            <ThumbPrint
              key={`${element}-${index}`}
              data={element}
              onClick={handleThumbClick}
              isActive={element === clickedData}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h4 style={{ margin: '5px' }}> {`Scanning ${clickedData || thumbsList[0]}`} </h4>
        <div className={styles.gridContainer}></div>
      </section>

      <section className={styles.section}>
        <h4> One more scan to go</h4>
      </section>
    </div>
  );

  const footer = (
    <ButtonSet className={isDesktop(layout) ? styles.desktop : styles.tablet}>
      <Button className={styles.button} kind="secondary" onClick={closeOverlay}>
        {t('cancel', 'Cancel')}
      </Button>
      <Button className={styles.button} kind="primary" onClick={handleSubmittingFingerPrints}>
        {t('saveFingerPrints', 'Save FingerPrints ')}
      </Button>
    </ButtonSet>
  );

  return { body, footer };
}
