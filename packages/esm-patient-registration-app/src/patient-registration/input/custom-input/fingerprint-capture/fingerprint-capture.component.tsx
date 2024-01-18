import React from 'react';
import Overlay from '../../../ui-components/overlay';
import { useTranslation } from 'react-i18next';
import { isDesktop, useLayoutType } from '@openmrs/esm-framework';
import { Button, ButtonSet, Checkbox, Search, RadioButtonGroup, RadioButton } from '@carbon/react';
import styles from './fingerprint-capture.scss';

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
      <div></div>
    </Overlay>
  );
};
