import React from 'react';
import Overlay from '../../../ui-components/overlay/overlay.component';
import { useTranslation } from 'react-i18next';
import { useFingerprintCapture } from './use-fingerprint-capture';

interface FingerPrintCaptureOverlay {
  closeOverlay: () => void;
}

/**
 * Classic (overlay-style) fingerprint capture. On desktop in the wide
 * layout the docked workspace panel is used instead; this full-screen
 * takeover overlay remains the tablet and classic-layout variant.
 */
const FingerPrintCapture: React.FC<FingerPrintCaptureOverlay> = ({ closeOverlay }) => {
  const { t } = useTranslation();
  const { body, footer } = useFingerprintCapture(closeOverlay);

  return (
    <Overlay close={closeOverlay} header={t('addFingerPrint', 'Add Patient Fingerprints')} buttonsGroup={footer}>
      {body}
    </Overlay>
  );
};

export default FingerPrintCapture;
