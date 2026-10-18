import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type WorkspacePanelId = 'identifiers' | 'fingerprints';

export interface WorkspaceContextProps {
  activePanel: WorkspacePanelId | null;
  openPanel: (id: WorkspacePanelId) => void;
  closePanel: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

export const WorkspaceContextProvider = WorkspaceContext.Provider;

export const useWorkspaceContext = (): WorkspaceContextProps => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceContextProvider');
  }
  return ctx;
};

export function useWorkspacePanelState(): WorkspaceContextProps {
  const [activePanel, setActivePanel] = useState<WorkspacePanelId | null>(null);
  const openPanel = useCallback((id: WorkspacePanelId) => setActivePanel(id), []);
  const closePanel = useCallback(() => setActivePanel(null), []);
  return useMemo(() => ({ activePanel, openPanel, closePanel }), [activePanel, openPanel, closePanel]);
}
