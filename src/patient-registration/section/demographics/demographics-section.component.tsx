import React, { useEffect } from 'react';
import { useField } from 'formik';
import { Field } from '../../field/field.component';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import { SectionGrid } from '../section-grid.component';

export interface DemographicsSectionProps {
  fields: Array<string>;
}

// The name field renders its own names/photo grid and the identifiers card
// needs the room, so both span the full row; gender and date of birth pair
// up in the two-column flow.
const fullWidthFields: ReadonlyArray<string> = ['name', 'id'];

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

  return <SectionGrid aria-label="Demographics Section" fields={fields} fullWidthFields={fullWidthFields} />;
};
