import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectItem } from '@carbon/react';
import { useGetPatientRegistries } from '../../verification-constants';
import styles from '../../patient-verification.scss';

const RegistrySelect = ({ values, setValues }) => {
  const { t } = useTranslation();
  return (
    <Select
      labelText={t('selectRegistry', 'Choose a Registry')}
      id="registry-select"
      invalidText="Required"
      className={styles['fieldInput']}
      value={values.registry}
      onChange={(event) =>
        setValues({
          ...values,
          registry: event.target.value,
        })
      }>
      <SelectItem key={'registry'} text={'Select Registry'} value={''}>
        {' '}
      </SelectItem>
      {useGetPatientRegistries()?.patientRegistries.map((registry) => (
        <SelectItem key={registry.uuid} text={registry.name} value={registry.url}>
          {registry.name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default RegistrySelect;
