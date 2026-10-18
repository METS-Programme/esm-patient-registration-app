import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import DataList from '../data-table/data-table.component';
import { ChooseItem } from '@carbon/react/icons';
import styles from './confirm-prompt.scss';
import { EmptyStateComponent } from '../../patient-registration/empty-state/empty-state.component';

interface MultiplePatientPromptProps {
  onConfirm: void;
  close: void;
  patient: any;
}

const MultiplePatientPrompt: React.FC<MultiplePatientPromptProps> = ({ close, onConfirm, patient }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={`${styles.tableHeaderContainer} cds--modal-header`}>
        <h3 className={`${styles.tableHeader} cds--modal-header__heading`}> {`${patient?.length}`} Patients Found </h3>
      </div>
      <div className="cds--modal-content">
        {patient.length > 0 ? <DataList data={patient} columns={registryPatientHeaders} /> : <EmptyStateComponent />}
      </div>
      <div className="cds--modal-footer">
        <Button kind="secondary" onClick={close}>
          {t('close', 'Close')}
        </Button>
      </div>
    </>
  );
};

export default MultiplePatientPrompt;

export const registryPatientHeaders = [
  {
    id: '1',
    key: 'names',
    header: 'Patient Name',
    accessor: 'names',
  },
  {
    id: '2',
    key: 'age',
    header: 'AGE',
    accessor: 'age',
  },
  {
    id: '3',
    key: 'birthdate',
    header: 'DATE OF BIRTH',
    accessor: 'birthdate',
  },
  {
    id: '4',
    key: 'gender',
    header: 'GENDER',
    accessor: 'gender',
  },
  {
    id: '5',
    key: 'actions',
    header: 'ACTIONS',
    accessor: 'actions',
  },
];

export const TableAction = (selectPatient) => {
  return (
    <Button
      type="button"
      size="sm"
      className="submitButton clear-padding-margin"
      iconDescription={'Pick Patient'}
      kind="ghost"
      renderIcon={ChooseItem}
      hasIconOnly
      onClick={selectPatient}
    />
  );
};
