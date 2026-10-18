import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalHeader, ModalBody, ModalFooter } from '@carbon/react';

interface DeleteIdentifierConfirmationModalProps {
  deleteIdentifier: (x: boolean) => void;
  identifierName: string;
  identifierValue: string;
}

const DeleteIdentifierConfirmationModal: React.FC<DeleteIdentifierConfirmationModalProps> = ({
  deleteIdentifier,
  identifierName,
  identifierValue,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ModalHeader
        label={t('deleteIdentifierModalHeading', 'Remove identifier?')}
        title={t('deleteIdentifierModalHeading', 'Remove identifier?')}
      />
      <ModalBody>
        <p>
          {identifierName}
          {t('deleteIdentifierModalText', ' has a value of ')} {identifierValue}
        </p>
        <p>{t('confirmIdentifierDeletionText', 'Are you sure you want to remove this identifier?')}</p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={() => deleteIdentifier(false)}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={() => deleteIdentifier(true)}>
          {t('removeIdentifierButton', 'Remove Identifier')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default DeleteIdentifierConfirmationModal;
