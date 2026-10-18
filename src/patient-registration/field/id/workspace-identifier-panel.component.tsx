import React from 'react';
import { useTranslation } from 'react-i18next';
import { type FormValues } from '../../patient-registration.types';
import { WorkspacePanel } from '../../workspace/workspace-panel.component';
import { useIdentifierSelection } from './use-identifier-selection';

interface WorkspaceIdentifierPanelProps {
  setFieldValue: (key: string, value: FormValues['identifiers']) => void;
  closeOverlay: () => void;
}

/**
 * Docked (wide-layout, desktop) variant of the identifier picker. Shares its
 * selection logic with the classic overlay via useIdentifierSelection.
 */
export const WorkspaceIdentifierPanel: React.FC<WorkspaceIdentifierPanelProps> = ({ closeOverlay, setFieldValue }) => {
  const { t } = useTranslation();
  const { body, footer } = useIdentifierSelection(setFieldValue, closeOverlay);

  return (
    <WorkspacePanel title={t('configureIdentifiers', 'Configure identifiers')} close={closeOverlay} footer={footer}>
      {body}
    </WorkspacePanel>
  );
};
