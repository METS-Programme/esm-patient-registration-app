import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '@openmrs/esm-framework';
import { Tile, Checkbox } from '@carbon/react';
import { FormikProps } from 'formik';
import { countries } from './assets/verification-assets';
import { searchRegistry } from './patient-verification-hook';
import { generateUICFromVerification, handleRegistryResponse } from './patient-verification-utils';
import { FormValues } from '../patient-registration/patient-registration.types';
import styles from './patient-verification.scss';
import VerificationSection from './verification-forms/verification-section-component';
import { VerificationSearchParams } from './verification-types';

interface PatientVerificationProps {
  formProps: FormikProps<FormValues>;
  verificationParams: VerificationSearchParams;
  setVerificationParams: (params: VerificationSearchParams) => void;
}

const PatientVerification: React.FC<PatientVerificationProps> = ({
  formProps,
  verificationParams,
  setVerificationParams,
}) => {
  const { t } = useTranslation();
  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    firstName: '',
    familyName: '',
    otherName: '',
    dateOfBirth: '',
    gender: '',
    country: countries[0]['name'],
  });
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [verifyClient, setVerifyClient] = useState(false);

  useEffect(() => {
    if (advancedSearchParams.dateOfBirth.length !== 0 && advancedSearchParams.gender.length !== 0) {
      const UIC = generateUICFromVerification(advancedSearchParams);
      setVerificationParams({
        ...verificationParams,
        identifier: UIC,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advancedSearchParams]);

  const handleSearch = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsLoadingSearch(true);
    try {
      const registryResponse = await searchRegistry(verificationParams, advancedSearchParams);
      setIsLoadingSearch(false);
      handleRegistryResponse(registryResponse, formProps, advancedSearchParams, verificationParams.identifier);
    } catch (error) {
      showToast({
        title: 'Client registry error',
        description: `Please reload the registration page and try again, if the issue persists contact system administrator`,
        kind: 'error',
        critical: true,
      });
      setIsLoadingSearch(false);
    }
  };

  return (
    <div id={'patientVerification'} style={{ margin: '0 0 0.5rem 0' }}>
      <Checkbox
        className=""
        labelText="Verify Patient with Registry"
        id="patient-verification-check"
        checked={verifyClient}
        onChange={(e, { checked }) => setVerifyClient(checked)}
      />
      {verifyClient ? (
        <Tile>
          <h4 className={styles.productiveHeading02} style={{ color: '#161616', margin: '0 0 0.5rem 0' }}>
            {t('patientVerification', 'Patient Verification')}
          </h4>
          <VerificationSection
            handleSearch={handleSearch}
            setAdvancedSearchParams={setAdvancedSearchParams}
            advancedSearchParams={advancedSearchParams}
            isLoading={isLoadingSearch}
            basicSearchParams={verificationParams}
            setBasicSearchParams={setVerificationParams}
          />
        </Tile>
      ) : (
        ''
      )}
    </div>
  );
};

export default PatientVerification;
