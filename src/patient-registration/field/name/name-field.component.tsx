import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ContentSwitcher, Switch } from '@carbon/react';
import { useField } from 'formik';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../../config-schema';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import { Input } from '../../input/basic-input/input/input.component';
import styles from '../field.scss';

export const unidentifiedPatientAttributeTypeUuid = '8b56eac7-5c76-4b9c-8c6f-1deab8d3fc47';
const containsNoNumbers = /^([^0-9]*)$/;

function checkNumber(value: string) {
  if (!containsNoNumbers.test(value)) {
    return 'numberInNameDubious';
  }

  return undefined;
}

export const NameField = () => {
  const { t } = useTranslation();
  const { setFieldValue, setFieldTouched } = usePatientRegistrationContext();

  const {
    fieldConfigurations: {
      name: {
        allowUnidentifiedPatients,
        defaultUnknownGivenName,
        defaultUnknownFamilyName,
        displayMiddleName,
        displayReverseFieldOrder,
      },
    },
  } = useConfig<RegistrationConfig>();

  const [{ value: isPatientUnknownValue }, , { setValue: setUnknownPatient }] = useField<string>(
    `attributes.${unidentifiedPatientAttributeTypeUuid}`,
  );

  const isPatientUnknown = isPatientUnknownValue === 'true';

  const toggleNameKnown = (e) => {
    if (e.name === 'known') {
      setFieldValue('givenName', '');
      setFieldValue('familyName', '');
      setUnknownPatient('false');
    } else {
      setFieldValue('givenName', defaultUnknownGivenName);
      setFieldValue('familyName', defaultUnknownFamilyName);
      setUnknownPatient('true');
    }
    setFieldTouched('givenName', true);
    setFieldTouched('familyName', true);
    setFieldTouched(`attributes.${unidentifiedPatientAttributeTypeUuid}`, true, false);
  };

  const firstNameField = (
    <Input
      id="givenName"
      name="givenName"
      labelText={t('givenNameLabelText', 'First Name')}
      checkWarning={checkNumber}
      required
    />
  );

  const middleNameField = (
    <Input
      id="middleName"
      name="middleName"
      labelText={t('middleNameLabelText', 'Middle Name')}
      checkWarning={checkNumber}
    />
  );

  const familyNameField = (
    <Input
      id="familyName"
      name="familyName"
      labelText={t('familyNameLabelText', 'Family Name')}
      checkWarning={checkNumber}
      required
    />
  );

  // With all three names configured, the first field leads the card on a
  // full row and the other two sit alongside each other beneath it where
  // the card is wide enough (see the nameCard container queries in
  // field.scss). When the configured field order is reversed, the family
  // name leads instead; with the middle name hidden, both remaining fields
  // share the row.
  const orderedNameFields = displayReverseFieldOrder
    ? [familyNameField, ...(displayMiddleName ? [middleNameField] : []), firstNameField]
    : [firstNameField, ...(displayMiddleName ? [middleNameField] : []), familyNameField];

  return (
    <div className={styles.nameCard}>
      <h4 className={styles.productiveHeading02Light}>{t('fullNameLabelText', 'Full Name')}</h4>
      {(allowUnidentifiedPatients || isPatientUnknown) && (
        <div className={styles.nameKnown}>
          <span className={styles.label01}>{t('patientNameKnown', "Patient's Name is Known?")}</span>
          <ContentSwitcher
            className={styles.contentSwitcher}
            size="md"
            selectedIndex={isPatientUnknown ? 1 : 0}
            onChange={toggleNameKnown}>
            <Switch name="known">{t('yes', 'Yes')}</Switch>
            <Switch name="unknown">{t('no', 'No')}</Switch>
          </ContentSwitcher>
        </div>
      )}
      {!isPatientUnknown && (
        <div className={styles.nameFields}>
          {orderedNameFields.map((field, index) => (
            <div
              key={index}
              className={classNames(styles.nameFieldItem, displayMiddleName && index === 0 && styles.nameFieldLead)}>
              {field}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
