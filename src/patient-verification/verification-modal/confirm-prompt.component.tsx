import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { age, ExtensionSlot, formatDate } from '@openmrs/esm-framework';
import capitalize from 'lodash-es/capitalize';
import styles from './confirm-prompt.scss';

const PatientInfo: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.25fr 0.75fr', margin: '0.25rem' }}>
      <span style={{ minWidth: '5rem', fontWeight: 'bold' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
};

interface ConfirmPromptProps {
  onConfirm: void;
  close: void;
  patient: any;
}

const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({ close, onConfirm, patient }) => {
  const { t } = useTranslation();
  const { name, gender, birthDate } = patient;

  const { family, given } = name[0];
  return (
    <>
      <div className="cds--modal-header">
        <h3 className="cds--modal-header__heading">Patient found</h3>
      </div>
      <div className="cds--modal-content">
        <p>
          Data for{' '}
          <b className={styles.name}>
            {given} {family}
          </b>{' '}
          was found in the registry. Do you want to use this data to the patient?
        </p>
        <div style={{ display: 'flex', margin: '1rem' }}>
          <ExtensionSlot
            style={{ display: 'flex', alignItems: 'center' }}
            name="patient-photo-slot"
            state={{ patientName: `${given} ${family}` }}
          />
          <div style={{ width: '100%', marginLeft: '0.625rem' }}>
            <PatientInfo label={t('patientName', 'Patient name')} value={`${given} ${family}`} />
            <PatientInfo label={t('age', 'Age')} value={age(birthDate)} />
            <PatientInfo label={t('dateOfBirth', 'Date of Birth')} value={formatDate(new Date(birthDate))} />
            <PatientInfo label={t('gender', 'Gender')} value={capitalize(gender)} />
          </div>
        </div>
      </div>
      <div className="cds--modal-footer">
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button onClick={onConfirm}>{t('proceed', 'Proceed')}</Button>
      </div>
    </>
  );
};

export default ConfirmPrompt;
