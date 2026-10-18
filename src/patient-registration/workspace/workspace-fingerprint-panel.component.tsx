import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorkspacePanel } from './workspace-panel.component';
import { useFingerprintCapture } from '../input/custom-input/fingerprint-capture/use-fingerprint-capture';

interface WorkspaceFingerprintPanelProps {
  closeOverlay: () => void;
}

/**
 * Docked (wide-layout, desktop) variant of the fingerprint capture. Shares
 * its selection logic with the classic overlay via useFingerprintCapture.
 * Like the identifier panel, it is a flex sibling of the form, so it pushes
 * the registration workspace instead of covering it.
 */
export const WorkspaceFingerprintPanel: React.FC<WorkspaceFingerprintPanelProps> = ({ closeOverlay }) => {
  const { t } = useTranslation();
  const { body, footer } = useFingerprintCapture(closeOverlay);

  return (
    <WorkspacePanel title={t('addFingerPrint', 'Add Patient Fingerprints')} close={closeOverlay} footer={footer}>
      {body}
    </WorkspacePanel>
  );
};
