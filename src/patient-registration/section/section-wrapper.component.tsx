import React from 'react';
import { useTranslation } from 'react-i18next';
import { type SectionDefinition } from '../../config-schema';
import { Section } from './section.component';
import { SectionHeading } from './section-heading.component';
import styles from './section.scss';

export interface SectionWrapperProps {
  sectionDefinition: SectionDefinition;
  index: number;
}

export const SectionWrapper = ({ sectionDefinition, index }: SectionWrapperProps) => {
  const { t } = useTranslation();

  /*
   * This comment exists to provide translation keys for the default section names.
   *
   * DO NOT REMOVE THESE UNLESS A DEFAULT SECTION IS REMOVED
   * t('demographicsSection', 'Basic Info')
   * t('contactSection', 'Contact Details')
   * t('deathSection', 'Death Info')
   * t('relationshipsSection', 'Relationships')
   */
  return (
    <div id={sectionDefinition.id} className={styles.section}>
      <SectionHeading index={index} title={t(`${sectionDefinition.id}Section`, sectionDefinition.name)} />
      <div className={styles.sectionBody}>
        <Section sectionDefinition={sectionDefinition} />
      </div>
    </div>
  );
};
