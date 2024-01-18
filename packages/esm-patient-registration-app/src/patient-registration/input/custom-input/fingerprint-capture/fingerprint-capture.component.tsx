import React, { useState } from 'react';
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

  const thumbsList = ['Right Thumb', 'Right Index', 'Left Thumb', 'Left Index', 'Right Middle', 'Left Middle'];

  const [clickeditem, setClickedItem] = useState<number | null>();

  // save fingerPrints
  const handleSubmittingFingerPrints = () => {
    console.info('Successfully submitted fingerPrint');
  };

  const handleThumbClick = (index: number) => setClickedItem(index);

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
              <ThumbPrint key={`${element}-${index}`} data={element} onClick={handleThumbClick(index)} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h4 style={{ margin: '5px' }}> {`Scanning ${thumbsList[clickeditem]}`} </h4>
          <div className={styles.gridContainer}></div>
        </section>

        <section className={styles.section}>
          <h4> One more scan to go</h4>
        </section>
      </div>
    </Overlay>
  );
};
