import React from 'react';
import { useTranslation } from 'react-i18next';
import { type FormValues } from '../../patient-registration.types';
import Overlay from '../../ui-components/overlay/overlay.component';
import { useIdentifierSelection } from './use-identifier-selection';

interface PatientIdentifierOverlayProps {
  setFieldValue: (key: string, value: FormValues['identifiers']) => void;
  closeOverlay: () => void;
}

/**
 * Classic (overlay-style) identifier picker. On desktop in the wide layout
 * the docked workspace panel is used instead; this full-screen-takeover
 * overlay remains the tablet and classic-layout variant.
 */
const PatientIdentifierOverlay: React.FC<PatientIdentifierOverlayProps> = ({ closeOverlay, setFieldValue }) => {
  const { t } = useTranslation();
  const { body, footer } = useIdentifierSelection(setFieldValue, closeOverlay);

  return (
    <Overlay close={closeOverlay} header={t('configureIdentifiers', 'Configure identifiers')} buttonsGroup={footer}>
      {body}
    </Overlay>
  );
};

export default PatientIdentifierOverlay;
