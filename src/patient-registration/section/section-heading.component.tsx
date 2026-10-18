import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './section.scss';

interface SectionHeadingProps {
  index: number;
  title: string;
  /** Optional right-aligned action rendered in the heading row. */
  action?: React.ReactNode;
}

export const SectionHeading = ({ index, title, action }: SectionHeadingProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.sectionHeadingRow}>
      <div>
        <h3 className={styles.sectionHeading}>
          <span className={styles.sectionNumber}>{index + 1}.</span> {title}
        </h3>
        <span className={styles.sectionCaption}>
          {t('allFieldsRequiredText', 'All fields are required unless marked optional')}
        </span>
      </div>
      {action && <div className={styles.sectionAction}>{action}</div>}
    </div>
  );
};
