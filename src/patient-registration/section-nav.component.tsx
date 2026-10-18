import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { type SectionDefinition } from '../config-schema';
import styles from './patient-registration.scss';

interface SectionNavProps {
  sections: Array<SectionDefinition>;
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
}

export const SectionNav = ({ sections, activeSection, onNavigate }: SectionNavProps) => {
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
    <nav aria-label={t('sectionsNav', 'Sections')} className={styles.navList}>
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className={classNames(styles.navItem, section.id === activeSection && styles.navItemActive)}
          aria-current={section.id === activeSection ? 'true' : undefined}
          onClick={() => onNavigate(section.id)}>
          <span className={styles.navNumber} aria-hidden="true">
            {index + 1}
          </span>
          <span className={styles.navText}>
            <span className={styles.navTitle}>{t(`${section.id}Section`, section.name)}</span>
            {section.description && (
              <span className={styles.navCaption}>{t(`${section.id}SectionDescription`, section.description)}</span>
            )}
          </span>
        </button>
      ))}
    </nav>
  );
};
