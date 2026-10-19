import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { type SectionDefinition } from '../config-schema';
import styles from './patient-registration.scss';

interface SectionNavProps {
  sections: Array<SectionDefinition>;
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
  collapsed?: boolean;
  /** Phone layout: a compact horizontal stepper rendered above the form. */
  horizontal?: boolean;
  id?: string;
}

export const SectionNav = ({ sections, activeSection, onNavigate, collapsed, horizontal, id }: SectionNavProps) => {
  const { t } = useTranslation();

  /*
   * This comment exists to provide translation keys for the default section descriptions.
   *
   * DO NOT REMOVE THESE UNLESS A DEFAULT SECTION IS REMOVED
   * t('demographicsSectionDescription', 'Name, sex, birth date')
   * t('contactSectionDescription', 'Address, phone, contact info')
   * t('deathSectionDescription', 'Death date and cause')
   * t('relationshipsSectionDescription', 'Guardians, caregivers')
   */
  return (
    <nav
      id={id}
      aria-label={t('sectionsNav', 'Sections')}
      className={classNames(styles.navList, horizontal && styles.navListHorizontal)}>
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className={classNames(styles.navItem, section.id === activeSection && styles.navItemActive)}
          aria-current={section.id === activeSection ? 'true' : undefined}
          title={collapsed ? t(`${section.id}Section`, section.name) : undefined}
          onClick={() => onNavigate(section.id)}>
          <span className={styles.navNumber} aria-hidden="true">
            {index + 1}
          </span>
          {!collapsed && (
            <span className={styles.navText}>
              <span className={styles.navTitle}>{t(`${section.id}Section`, section.name)}</span>
              {section.description && !horizontal && (
                <span className={styles.navCaption}>{t(`${section.id}SectionDescription`, section.description)}</span>
              )}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};
