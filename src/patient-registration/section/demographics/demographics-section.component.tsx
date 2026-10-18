import React, { useEffect } from 'react';
import { useField } from 'formik';
import { Field } from '../../field/field.component';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import { SectionGrid } from '../section-grid.component';

export interface DemographicsSectionProps {
  fields: Array<string>;
}

// The name card sits on the left spanning two rows, with sex above and
// date of birth beside it on the right; identifiers take the full row
// below.
const fullWidthFields: ReadonlyArray<string> = ['id'];
const tallFields: ReadonlyArray<string> = ['name'];

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

  return (
    <SectionGrid
      aria-label="Demographics Section"
      fields={fields}
      fullWidthFields={fullWidthFields}
      tallFields={tallFields}
    />
  );
};
