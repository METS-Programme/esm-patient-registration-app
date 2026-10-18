import React, { useState } from 'react';
import styles from '../patient-verification.scss';
import BasicSearchForm from '../verification-forms/basic-search-form.component';
import AdvancedSearchForm from '../verification-forms/advanced-search-form.component';

const VerificationSection = ({
  advancedSearchParams,
  setAdvancedSearchParams,
  handleSearch,
  isLoading,
  basicSearchParams,
  setBasicSearchParams,
  // handleValidate,
}) => {
  const [showSection, setShowSection] = useState(false);
  const [UICMode, setUICMode] = useState(false); //generating UIC
  const handleClick = (event) => {
    event.preventDefault();
    setShowSection((showSection) => !showSection);
    setUICMode((UICMode) => !UICMode);
  };
  return (
    <div className={styles['cr-1']}>
      <BasicSearchForm
        isLoading={isLoading}
        basicSearchParams={basicSearchParams}
        setBasicSearchParams={setBasicSearchParams}
        handleSearch={handleSearch}
        editableInput={UICMode}
      />
      <div className={styles.expandBtnSection}>
        <button onClick={handleClick}>Advanced Search (by UIC)</button>
      </div>
      {showSection ? (
        <AdvancedSearchForm
          advancedSearchParams={advancedSearchParams}
          setAdvancedSearchParams={setAdvancedSearchParams}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default VerificationSection;
