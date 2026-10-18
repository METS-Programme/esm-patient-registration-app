import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, Layer, Search, Column, Stack, Form } from '@carbon/react';
import styles from '../patient-verification.scss';
import RegistrySelect from './fields/registry-select.component';

const BasicSearchForm = ({ isLoading, basicSearchParams, setBasicSearchParams, handleSearch, editableInput }) => {
  const { t } = useTranslation();
  const disableButton = !basicSearchParams.registry.length;
  return (
    <Form onSubmit={handleSearch} className={''}>
      <Stack gap={3}>
        <Column className={styles.verificationWrapper}>
          <Layer className={styles.layer}>
            <RegistrySelect values={basicSearchParams} setValues={setBasicSearchParams} />
          </Layer>
          <Layer className={styles.layer}>
            <Search
              id={'patientIdNumber'}
              type="text"
              readOnly={editableInput}
              autoFocus
              placeholder={t('patientIdentifierNumber', 'Patient Identifier Number')}
              labelText="Patient Identifier Number"
              className={styles['']}
              value={basicSearchParams.identifier}
              onChange={(event) =>
                setBasicSearchParams({
                  ...basicSearchParams,
                  identifier: event.target.value,
                })
              }
            />
          </Layer>
          <div className={styles.layer}>
            {!isLoading ? (
              <Button className={styles.fullWidth} disabled={disableButton} size="md" onClick={handleSearch}>
                {t('search', 'Search Registry')}
              </Button>
            ) : (
              <InlineLoading status="active" iconDescription="Loading" description="Searching registry" />
            )}
          </div>
        </Column>
      </Stack>
    </Form>
  );
};

export default BasicSearchForm;
