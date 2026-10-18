import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button, InlineLoading } from '@carbon/react';
import { ChevronLeft, ChevronRight, Close, Save } from '@carbon/react/icons';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form, Formik, type FormikHelpers, type FormikErrors } from 'formik';
import {
  createErrorHandler,
  interpolateUrl,
  isDesktop,
  showSnackbar,
  useConfig,
  useLayoutType,
  usePatient,
  usePatientPhoto,
} from '@openmrs/esm-framework';
import { builtInSections, type RegistrationConfig, type SectionDefinition } from '../config-schema';
import { cancelRegistration, filterOutUndefinedPatientIdentifiers, scrollIntoView } from './patient-registration-utils';
import { getValidationSchema } from './validation/patient-registration-validation';
import { DummyDataInput } from './input/dummy-data/dummy-data-input.component';
import { PatientRegistrationContextProvider } from './patient-registration-context';
import { useWorkspacePanelState, WorkspaceContextProvider } from './workspace/workspace-context';
import { WorkspaceIdentifierPanel } from './field/id/workspace-identifier-panel.component';
import { WorkspaceFingerprintPanel } from './workspace/workspace-fingerprint-panel.component';
import { useResourcesContext } from '../resources-context';
import { SectionWrapper } from './section/section-wrapper.component';
import { type CapturePhotoProps, type FormValues } from './patient-registration.types';
import { type SavePatientForm, SavePatientTransactionManager } from './form-manager';
import { useInitialFormValues, usePatientUuidMap } from './patient-registration-hooks';
import { useActiveSection } from './use-active-section';
import { SectionNav } from './section-nav.component';
import BeforeSavePrompt from './before-save-prompt.component';
import PatientVerification from '../patient-verification/patient-verification.component';
import { type VerificationSearchParams } from '../patient-verification/verification-types';
import styles from './patient-registration.scss';

let exportedInitialFormValuesForTesting = {} as FormValues;

export interface PatientRegistrationProps {
  savePatientForm: SavePatientForm;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({ savePatientForm }) => {
  const { patientUuid } = useParams();

  return <PatientRegistrationForm key={patientUuid ?? 'new-patient'} savePatientForm={savePatientForm} />;
};

const PatientRegistrationForm: React.FC<PatientRegistrationProps> = ({ savePatientForm }) => {
  const { t } = useTranslation();
  const { currentSession, identifierTypes } = useResourcesContext();
  const { patientUuid: uuidOfPatientToEdit } = useParams();
  const { search } = useLocation();
  const { isLoading: isLoadingPatientToEdit, patient: patientToEdit } = usePatient(uuidOfPatientToEdit);
  const config = useConfig<RegistrationConfig>();

  const [initialFormValues, setInitialFormValues] = useInitialFormValues(patientToEdit, uuidOfPatientToEdit);

  const [patientUuidMap] = usePatientUuidMap({}, patientToEdit, uuidOfPatientToEdit);

  const [target, setTarget] = useState<undefined | string>();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [capturePhotoProps, setCapturePhotoProps] = useState<CapturePhotoProps | null>(null);
  const [verificationSearchParams, setVerificationSearchParams] = useState<VerificationSearchParams>({
    registry: '',
    identifier: '',
  });

  const location = currentSession?.sessionLocation?.uuid;
  const inEditMode = isLoadingPatientToEdit ? undefined : !!(uuidOfPatientToEdit && patientToEdit);
  const layoutVariant = config.layout?.variant ?? 'wide';
  const layout = useLayoutType();
  const workspace = useWorkspacePanelState();
  const dockedPanelOpen = layoutVariant === 'wide' && isDesktop(layout) && workspace.activePanel !== null;
  const formContainerRef = useRef<HTMLDivElement>(null);
  const showDummyDataInput = useMemo(
    () => localStorage.getItem('openmrs:devtools') === 'true' && !inEditMode,
    [inEditMode],
  );
  const { data: photo } = usePatientPhoto(patientToEdit?.id);
  const savePatientTransactionManager = useRef(new SavePatientTransactionManager());
  const validationSchema = getValidationSchema(config, t);

  useEffect(() => {
    exportedInitialFormValuesForTesting = initialFormValues;
  }, [initialFormValues]);

  const sections: Array<SectionDefinition> = useMemo(() => {
    return config.sections
      .map(
        (sectionName) =>
          config.sectionDefinitions.filter((s) => s.id === sectionName)[0] ??
          builtInSections.filter((s) => s.id === sectionName)[0],
      )
      .filter((s) => s);
  }, [config.sections, config.sectionDefinitions]);

  const activeSection = useActiveSection(
    formContainerRef,
    useMemo(() => sections.map((s) => s.id), [sections]),
  );

  const onFormSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    helpers.setSubmitting(true);

    const updatedFormValues = { ...values, identifiers: filterOutUndefinedPatientIdentifiers(values.identifiers) };
    try {
      await savePatientForm(
        !inEditMode,
        updatedFormValues,
        patientUuidMap,
        capturePhotoProps,
        location,
        initialFormValues['identifiers'],
        currentSession,
        config,
        savePatientTransactionManager.current,
      );

      showSnackbar({
        subtitle: inEditMode
          ? t('updatePatientSuccessSnackbarSubtitle', "The patient's information has been successfully updated")
          : t(
              'registerPatientSuccessSnackbarSubtitle',
              'The patient can now be found by searching for them using their name or ID number',
            ),
        title: inEditMode
          ? t('updatePatientSuccessSnackbarTitle', 'Patient Details Updated')
          : t('registerPatientSuccessSnackbarTitle', 'New Patient Created'),
        kind: 'success',
        isLowContrast: true,
      });

      const afterUrl = new URLSearchParams(search).get('afterUrl');
      const redirectUrl = interpolateUrl(afterUrl || config.links.submitButton, { patientUuid: values.patientUuid });

      setTarget(redirectUrl);
    } catch (error) {
      if (error.responseBody?.error?.globalErrors) {
        error.responseBody.error.globalErrors.forEach((error) => {
          showSnackbar({
            title: inEditMode
              ? t('updatePatientErrorSnackbarTitle', 'Patient Details Update Failed')
              : t('registrationErrorSnackbarTitle', 'Patient Registration Failed'),
            subtitle: error.message,
            kind: 'error',
          });
        });
      } else if (error.responseBody?.error?.message) {
        showSnackbar({
          title: inEditMode
            ? t('updatePatientErrorSnackbarTitle', 'Patient Details Update Failed')
            : t('registrationErrorSnackbarTitle', 'Patient Registration Failed'),
          subtitle: error.responseBody.error.message,
          kind: 'error',
        });
      } else {
        createErrorHandler()(error);
      }

      helpers.setSubmitting(false);
    }
  };

  const getDescription = (errors: FormikErrors<FormValues>): React.JSX.Element => {
    return (
      <ul style={{ listStyle: 'inside' }}>
        {Object.keys(errors).map((error, index) => {
          return <li key={index}>{t(`${error}LabelText`, error)}</li>;
        })}
      </ul>
    );
  };

  const displayErrors = (errors: FormikErrors<FormValues>): void => {
    if (errors && typeof errors === 'object' && !!Object.keys(errors).length) {
      showSnackbar({
        isLowContrast: true,
        kind: 'warning',
        title: t('fieldsWithErrors', 'The following fields have errors:'),
        subtitle: <>{getDescription(errors)}</>,
      });
    }
  };

  const createContextValue = useCallback(
    (formikProps) => ({
      identifierTypes,
      validationSchema,
      values: formikProps.values,
      inEditMode,
      setFieldValue: formikProps.setFieldValue,
      setFieldTouched: formikProps.setFieldTouched,
      setCapturePhotoProps,
      currentPhoto: photo?.imageSrc,
      initialFormValues: formikProps.initialValues,
      setInitialFormValues,
    }),
    [identifierTypes, validationSchema, inEditMode, setCapturePhotoProps, photo?.imageSrc, setInitialFormValues],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialFormValues}
      onSubmit={onFormSubmit}
      validationSchema={validationSchema}>
      {(props) => (
        <WorkspaceContextProvider value={workspace}>
          <Form className={classNames(layoutVariant === 'wide' && styles.wideWorkspace)}>
            <BeforeSavePrompt when={Object.keys(props.touched).length > 0} redirect={target} />
            <div
              className={classNames(styles.formContainer, dockedPanelOpen && styles.panelOpen)}
              ref={formContainerRef}>
              <PatientRegistrationContextProvider value={createContextValue(props)}>
                {/* Navigation Sidebar */}
                <div className={classNames(styles.stickyColumn, navCollapsed && styles.collapsed)}>
                  <div className={styles.sidebarHeader}>
                    {!navCollapsed && (
                      <h4>
                        {inEditMode
                          ? t('editPatientDetails', 'Edit patient details')
                          : t('createNewPatient', 'Create new patient')}
                      </h4>
                    )}
                    <Button
                      className={styles.collapseToggle}
                      kind="ghost"
                      size="sm"
                      hasIconOnly
                      renderIcon={navCollapsed ? ChevronRight : ChevronLeft}
                      iconDescription={
                        navCollapsed
                          ? t('expandSectionNav', 'Expand section navigator')
                          : t('collapseSectionNav', 'Collapse section navigator')
                      }
                      tooltipAlignment="start"
                      aria-expanded={!navCollapsed}
                      aria-controls="registration-sections-nav"
                      onClick={() => setNavCollapsed((collapsed) => !collapsed)}
                    />
                  </div>
                  {showDummyDataInput && !navCollapsed && <DummyDataInput setValues={props.setValues} />}
                  {!navCollapsed && <p className={styles.label01}>{t('jumpTo', 'Jump to')}</p>}
                  <SectionNav
                    id="registration-sections-nav"
                    sections={sections}
                    activeSection={activeSection}
                    onNavigate={scrollIntoView}
                    collapsed={navCollapsed}
                  />
                  <div className={styles.sidebarActions}>
                    <hr className={styles.divider} />
                    <Button
                      className={styles.submitButton}
                      type="submit"
                      onClick={() => props.validateForm().then((errors) => displayErrors(errors))}
                      // Current session and identifiers are required for patient registration.
                      // If currentSession or identifierTypes are not available, then the
                      // user should be blocked to register the patient.
                      disabled={!currentSession || !identifierTypes || props.isSubmitting}
                      hasIconOnly={navCollapsed}
                      renderIcon={navCollapsed ? Save : undefined}
                      iconDescription={
                        navCollapsed
                          ? inEditMode
                            ? t('updatePatient', 'Update patient')
                            : t('registerPatient', 'Register patient')
                          : undefined
                      }>
                      {props.isSubmitting ? (
                        <InlineLoading
                          className={styles.spinner}
                          description={`${t('submitting', 'Submitting')} ...`}
                          iconDescription="submitting"
                        />
                      ) : navCollapsed ? null : inEditMode ? (
                        t('updatePatient', 'Update patient')
                      ) : (
                        t('registerPatient', 'Register patient')
                      )}
                    </Button>
                    <Button
                      className={styles.cancelButton}
                      kind="secondary"
                      onClick={cancelRegistration}
                      hasIconOnly={navCollapsed}
                      renderIcon={navCollapsed ? Close : undefined}
                      iconDescription={navCollapsed ? t('cancel', 'Cancel') : undefined}>
                      {navCollapsed ? null : t('cancel', 'Cancel')}
                    </Button>
                  </div>
                </div>
                {/* Registration Form */}
                <div className={styles.infoGrid}>
                  <PatientVerification
                    formProps={props}
                    verificationParams={verificationSearchParams}
                    setVerificationParams={setVerificationSearchParams}
                  />
                  {sections.map((section, index) => (
                    <SectionWrapper
                      key={`registration-section-${section.id}`}
                      sectionDefinition={section}
                      index={index}
                    />
                  ))}
                </div>
                {/* Docked workspace panels (wide layout, desktop): shrink the form
                    instead of overlaying it. */}
                {dockedPanelOpen && workspace.activePanel === 'identifiers' && (
                  <WorkspaceIdentifierPanel setFieldValue={props.setFieldValue} closeOverlay={workspace.closePanel} />
                )}
                {dockedPanelOpen && workspace.activePanel === 'fingerprints' && (
                  <WorkspaceFingerprintPanel closeOverlay={workspace.closePanel} />
                )}
              </PatientRegistrationContextProvider>
            </div>
          </Form>
        </WorkspaceContextProvider>
      )}
    </Formik>
  );
};

/**
 * @internal
 * Just exported for testing
 */
export { exportedInitialFormValuesForTesting as initialFormValues };
