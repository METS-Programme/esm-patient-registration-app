import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';

interface EmptyPromptProps {
  onConfirm: void;
  close: void;
}

const EmptyPrompt: React.FC<EmptyPromptProps> = ({ close, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="cds--modal-header">
        <h3 className="cds--modal-header__heading">
          {t('noMatchingRecordsFoundInRegistry', 'No matching records found')}
        </h3>
      </div>
      <div className="cds--modal-content">
        <p>{t('patientNotFound', 'Continue with registration to capture patient details')}</p>
      </div>
      <div className="cds--modal-footer">
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button onClick={onConfirm}>{t('continue', 'Continue to registration')}</Button>
      </div>
    </>
  );
};

export default EmptyPrompt;
