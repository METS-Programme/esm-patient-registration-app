import React from 'react';
import { Button, ModalHeader, ModalBody, ModalFooter } from '@carbon/react';
import { useTranslation } from 'react-i18next';

interface CancelPatientEditProps {
  close(): void;
  onConfirm(): void;
}

const CancelPatientEdit: React.FC<CancelPatientEditProps> = ({ close, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <>
      <ModalHeader
        label={t('discardChanges', 'Discard Changes')}
        title={t('discardModalHeader', 'Confirm Discard Changes')}
      />
      <ModalBody>
        <p>
          {t(
            'discardModalBody',
            "The changes you made to this patient's details have not been saved. Discard changes?",
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={onConfirm}>
          {t('discard', 'Discard')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default CancelPatientEdit;
