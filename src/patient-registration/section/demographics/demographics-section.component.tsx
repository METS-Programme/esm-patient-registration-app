import React, { useEffect } from 'react';
import { useField } from 'formik';
import { Field } from '../../field/field.component';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import { SectionGrid } from '../section-grid.component';

export interface DemographicsSectionProps {
  fields: Array<string>;
}

// Every field is a half-width card, so the section flows as paired cards
// (name | gender, date of birth | identifiers) like the reference design.
export const DemographicsSection: React.FC<DemographicsSectionProps> = ({ fields }) => {
  const [field, meta] = useField('addNameInLocalLanguage');
  const { setFieldValue } = usePatientRegistrationContext();

  useEffect(() => {
    if (!field.value && meta.touched) {
      setFieldValue('additionalGivenName', '');
      setFieldValue('additionalMiddleName', '');
      setFieldValue('additionalFamilyName', '');
    }
  }, [field.value, meta.touched, setFieldValue]);

  return <SectionGrid aria-label="Demographics Section" fields={fields} />;
};
