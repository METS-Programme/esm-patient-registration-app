import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { Close } from '@carbon/react/icons';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../config-schema';
import styles from './workspace-panel.scss';

interface WorkspacePanelProps {
  title: string;
  close: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * A right-docked, non-modal workspace panel. It is laid out as a flex
 * sibling of the registration form (see patient-registration.scss), so
 * opening it shrinks the form instead of covering it: no backdrop, no
 * focus trap, and the registration workspace stays interactive.
 */
export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({ title, close, footer, children }) => {
  const { t } = useTranslation();
  const config = useConfig<RegistrationConfig>();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    titleRef.current?.focus();
    return () => {
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  return (
    <aside
      role="complementary"
      aria-label={title}
      className={styles.panel}
      style={{ '--workspace-panel-width': `${config.layout?.panelWidth ?? 440}px` } as React.CSSProperties}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          close();
        }
      }}>
      <header className={styles.panelHeader}>
        <h4 ref={titleRef} tabIndex={-1} className={styles.panelTitle}>
          {title}
        </h4>
        <Button
          kind="ghost"
          hasIconOnly
          iconDescription={t('closeOverlay', 'Close overlay')}
          onClick={close}
          renderIcon={(props) => <Close size={16} {...props} />}
        />
      </header>
      <div className={styles.panelContent}>{children}</div>
      {footer ? <footer className={styles.panelFooter}>{footer}</footer> : null}
    </aside>
  );
};
