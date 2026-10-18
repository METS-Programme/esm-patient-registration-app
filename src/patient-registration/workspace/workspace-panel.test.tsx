import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDefaultsFromConfigSchema, useConfig } from '@openmrs/esm-framework';
import { esmPatientRegistrationSchema, type RegistrationConfig } from '../../config-schema';
import { WorkspacePanel } from './workspace-panel.component';

const mockUseConfig = vi.mocked(useConfig<RegistrationConfig>);

describe('WorkspacePanel', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue(getDefaultsFromConfigSchema(esmPatientRegistrationSchema) as RegistrationConfig);
  });

  it('renders title, close button, children and footer', () => {
    render(
      <WorkspacePanel title="Configure identifiers" close={vi.fn()} footer={<button type="button">Done</button>}>
        <p>Panel body</p>
      </WorkspacePanel>,
    );

    expect(screen.getByRole('complementary', { name: 'Configure identifiers' })).toBeInTheDocument();
    expect(screen.getByText('Panel body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close overlay' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  it('calls close when the close button is clicked', async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    render(
      <WorkspacePanel title="Configure identifiers" close={close}>
        <p>Panel body</p>
      </WorkspacePanel>,
    );

    await user.click(screen.getByRole('button', { name: 'Close overlay' }));

    expect(close).toHaveBeenCalledTimes(1);
  });

  it('calls close when Escape is pressed', async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    render(
      <WorkspacePanel title="Configure identifiers" close={close}>
        <p>Panel body</p>
      </WorkspacePanel>,
    );

    await user.keyboard('{Escape}');

    expect(close).toHaveBeenCalledTimes(1);
  });

  it('moves focus to the panel heading on mount and restores it on close', () => {
    // Simulate the real flow: the user focuses the Configure button, the
    // panel mounts, and on close the focus returns to the button.
    const Harness = ({ showPanel }: { showPanel: boolean }) => (
      <div>
        <button type="button">Open</button>
        {showPanel && (
          <WorkspacePanel title="Configure identifiers" close={vi.fn()}>
            <p>Panel body</p>
          </WorkspacePanel>
        )}
      </div>
    );

    const { rerender } = render(<Harness showPanel={false} />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();

    rerender(<Harness showPanel={true} />);
    expect(screen.getByRole('heading', { name: 'Configure identifiers' })).toHaveFocus();

    rerender(<Harness showPanel={false} />);
    expect(opener).toHaveFocus();
  });

  it('exposes the configured panel width as a CSS custom property', () => {
    mockUseConfig.mockReturnValue({
      ...getDefaultsFromConfigSchema(esmPatientRegistrationSchema),
      layout: { variant: 'wide', panelWidth: 500 },
    } as RegistrationConfig);

    render(
      <WorkspacePanel title="Configure identifiers" close={vi.fn()}>
        <p>Panel body</p>
      </WorkspacePanel>,
    );

    expect(screen.getByRole('complementary')).toHaveStyle({ '--workspace-panel-width': '500px' });
  });
});
