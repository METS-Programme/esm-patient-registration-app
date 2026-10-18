import React from 'react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { Form, Formik } from 'formik';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDefaultsFromConfigSchema, useConfig, useLayoutType, isDesktop } from '@openmrs/esm-framework';
import { mockPatient, mockSession } from '__mocks__';
import { renderWithContext } from 'tools';
import { esmPatientRegistrationSchema, type RegistrationConfig } from '../../../config-schema';
import {
  PatientRegistrationContextProvider,
  type PatientRegistrationContextProps,
} from '../../patient-registration-context';
import { ResourcesContextProvider } from '../../../resources-context';
import { WorkspaceIdentifierPanel } from './workspace-identifier-panel.component';
import type { AddressTemplate, FormValues, PatientIdentifierType } from '../../patient-registration.types';
import type { Resources } from '../../../registration.resource';

const mockUseConfig = vi.mocked(useConfig<RegistrationConfig>);
const mockUseLayoutType = vi.mocked(useLayoutType);
const mockIsDesktop = vi.mocked(isDesktop);

const mockIdentifierTypes: PatientIdentifierType[] = [
  {
    uuid: 'openmrs-id-uuid',
    name: 'OpenMRS ID',
    fieldName: 'openMrsId',
    format: '^[0-9]{5,6}$',
    formatDescription: 'Format: 5-6 digits',
    required: true,
    isPrimary: true,
    uniquenessBehavior: 'UNIQUE',
    identifierSources: [],
  },
  {
    uuid: 'passport-id-uuid',
    name: 'Passport Number',
    fieldName: 'passportId',
    format: '',
    required: false,
    isPrimary: false,
    uniquenessBehavior: 'NON_UNIQUE',
    identifierSources: [],
  },
];

const mockResourcesContextValue: Resources = {
  addressTemplate: {} as AddressTemplate,
  currentSession: mockSession.data,
  identifierTypes: mockIdentifierTypes,
  relationshipTypes: { results: [] },
} as Resources;

const mockInitialFormValues: FormValues = {
  additionalFamilyName: '',
  additionalGivenName: '',
  additionalMiddleName: '',
  addNameInLocalLanguage: false,
  address: {},
  birthdate: null,
  birthdateEstimated: false,
  deathCause: '',
  deathDate: '',
  deathTime: '',
  deathTimeFormat: 'AM' as 'AM' | 'PM',
  nonCodedCauseOfDeath: '',
  familyName: 'Doe',
  gender: 'male',
  givenName: 'John',
  identifiers: {},
  isDead: false,
  middleName: 'Test',
  monthsEstimated: 0,
  patientUuid: mockPatient.uuid,
  relationships: [],
  telephoneNumber: '',
  yearsEstimated: 0,
};

const mockContextValues: PatientRegistrationContextProps = {
  currentPhoto: null,
  inEditMode: false,
  identifierTypes: [],
  initialFormValues: mockInitialFormValues,
  setCapturePhotoProps: vi.fn(),
  setFieldValue: vi.fn(),
  setInitialFormValues: vi.fn(),
  validationSchema: null,
  values: mockInitialFormValues,
} as unknown as PatientRegistrationContextProps;

function renderWorkspaceIdentifierPanel() {
  const mockSetFieldValue = vi.fn();
  const mockCloseOverlay = vi.fn();

  const utils = renderWithContext(
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>
        <PatientRegistrationContextProvider value={mockContextValues}>
          <WorkspaceIdentifierPanel setFieldValue={mockSetFieldValue} closeOverlay={mockCloseOverlay} />
        </PatientRegistrationContextProvider>
      </Form>
    </Formik>,
    ResourcesContextProvider,
    mockResourcesContextValue,
  );

  return { ...utils, mockSetFieldValue, mockCloseOverlay };
}

describe('WorkspaceIdentifierPanel', () => {
  beforeEach(() => {
    mockIsDesktop.mockReturnValue(true);
    mockUseLayoutType.mockReturnValue('desktop' as any);
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(esmPatientRegistrationSchema),
      defaultPatientIdentifierTypes: [],
    });
  });

  it('renders as a docked complementary panel with the identifier checkboxes', () => {
    renderWorkspaceIdentifierPanel();

    expect(screen.getByRole('complementary', { name: 'Configure identifiers' })).toBeInTheDocument();
    expect(screen.getByLabelText('OpenMRS ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Passport Number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close overlay' })).toBeInTheDocument();
  });

  it('commits selected identifiers and closes on confirm', async () => {
    const user = userEvent.setup();
    const { mockSetFieldValue, mockCloseOverlay } = renderWorkspaceIdentifierPanel();

    await user.click(screen.getByLabelText('Passport Number'));
    await user.click(screen.getByRole('button', { name: 'Configure identifiers' }));

    expect(mockSetFieldValue).toHaveBeenCalledWith('identifiers', expect.any(Object));
    expect(mockCloseOverlay).toHaveBeenCalledTimes(1);
  });

  it('closes without committing on cancel', async () => {
    const user = userEvent.setup();
    const { mockSetFieldValue, mockCloseOverlay } = renderWorkspaceIdentifierPanel();

    await user.click(screen.getByLabelText('Passport Number'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockSetFieldValue).not.toHaveBeenCalled();
    expect(mockCloseOverlay).toHaveBeenCalledTimes(1);
  });
});
