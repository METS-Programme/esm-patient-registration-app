import React from 'react';
import { Button } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';
import { type FormValues, type RelationshipValue } from '../../patient-registration.types';

export function newRelationship(): RelationshipValue {
  return {
    clientId: v4(),
    relatedPersonUuid: '',
    action: 'ADD',
  } as RelationshipValue;
}

/**
 * Renders in the section heading row, so it lives outside the FieldArray —
 * it appends via Formik's setFieldValue with the same shape the FieldArray
 * path pushes.
 */
export const AddRelationshipButton: React.FC = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<FormValues>();

  return (
    <Button
      kind="ghost"
      renderIcon={(props) => <Add size={16} {...props} />}
      onClick={() => setFieldValue('relationships', [...(values.relationships ?? []), newRelationship()])}>
      {t('addRelationshipButtonText', 'Add relationship')}
    </Button>
  );
};
