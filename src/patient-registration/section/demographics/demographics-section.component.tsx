import React, { useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../../config-schema';
import { Field } from '../../field/field.component';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import { SectionGrid } from '../section-grid.component';
import styles from '../generic-section.scss';

export interface DemographicsSectionProps {
  fields: Array<string>;
}

// Sex and date of birth sit side by side; identifiers take the full row
// below them. The photo and name cards are pulled out of this flow into
// their own identity row (see identityGrid in generic-section.scss).
const fullWidthFields: ReadonlyArray<string> = ['id', 'name', 'photo'];

export const DemographicsSection: React.FC<DemographicsSectionProps> = ({ fields }) => {
  const [field, meta] = useField('addNameInLocalLanguage');
  const { setFieldValue } = usePatientRegistrationContext();
  const {
    fieldConfigurations: {
      name: { displayCapturePhoto },
    },
  } = useConfig<RegistrationConfig>();

  useEffect(() => {
    if (!field.value && meta.touched) {
      setFieldValue('additionalGivenName', '');
      setFieldValue('additionalMiddleName', '');
      setFieldValue('additionalFamilyName', '');
    }
  }, [field.value, meta.touched, setFieldValue]);

  // When photo capture is configured, the photo card leads a shared row
  // with the name card — independent cards, photo first — regardless of
  // where 'name' sits in the configured field order. Without capture, both
  // fields stay in the generic flow.
  const showIdentityRow = displayCapturePhoto && fields.includes('name');
  const remainingFields = useMemo(
    () => (showIdentityRow ? fields.filter((f) => f !== 'name' && f !== 'photo') : fields),
    [fields, showIdentityRow],
  );

  return (
    <section aria-label="Demographics Section">
      {showIdentityRow && (
        <div className={styles.identityGrid}>
          <div className={styles.fieldSlot} data-testid="patient-photo-card">
            <Field name="photo" />
          </div>
          <div className={styles.fieldSlot} data-testid="patient-name-card">
            <Field name="name" />
          </div>
        </div>
      )}
      <SectionGrid fields={remainingFields} fullWidthFields={fullWidthFields} />
    </section>
  );
};
