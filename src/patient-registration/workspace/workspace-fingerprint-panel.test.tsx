import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import { getDefaultsFromConfigSchema, useConfig } from '@openmrs/esm-framework';
import { esmPatientRegistrationSchema, type RegistrationConfig } from '../../config-schema';
import { WorkspaceFingerprintPanel } from './workspace-fingerprint-panel.component';
import { renderWithContext } from 'tools';

const mockUseConfig = vi.mocked(useConfig<RegistrationConfig>);

function renderWorkspaceFingerprintPanel() {
  const mockCloseOverlay = vi.fn();

  renderWithContext(
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>
        <WorkspaceFingerprintPanel closeOverlay={mockCloseOverlay} />
      </Form>
    </Formik>,
    // No resources provider needed — the fingerprint panel does not consume it.
    React.Fragment,
    {},
  );

  return { mockCloseOverlay };
}

describe('WorkspaceFingerprintPanel', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue(getDefaultsFromConfigSchema(esmPatientRegistrationSchema));
  });

  it('renders as a docked complementary panel with the thumb options', () => {
    renderWorkspaceFingerprintPanel();

    expect(screen.getByRole('complementary', { name: 'Add Patient Fingerprints' })).toBeInTheDocument();
    expect(screen.getByText('Select and scan fingerprint of the patient')).toBeInTheDocument();
    // Thumb options render as clickable tiles, not buttons.
    expect(screen.getByText('Scan Right Thumb')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close overlay' })).toBeInTheDocument();
  });

  it('closes on cancel', async () => {
    const user = userEvent.setup();
    const { mockCloseOverlay } = renderWorkspaceFingerprintPanel();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockCloseOverlay).toHaveBeenCalledTimes(1);
  });
});
