import React from 'react';
import classNames from 'classnames';
import { Field } from '../field/field.component';
import styles from './generic-section.scss';

interface SectionGridProps {
  fields: Array<string>;
  /** Field names that always span the full width of the grid. */
  fullWidthFields?: ReadonlyArray<string>;
  /** Field names that span two rows in the two-column flow. */
  tallFields?: ReadonlyArray<string>;
  'aria-label'?: string;
}

/**
 * Shared two-column field grid for the wide layout (see generic-section.scss).
 * Field order is preserved — no auto-flow reordering in a clinical form.
 */
export const SectionGrid = ({ fields, fullWidthFields = [], tallFields = [], ...rest }: SectionGridProps) => (
  <section {...rest} className={styles.fieldsGrid}>
    {fields.map((name) => (
      <div
        key={name}
        className={classNames(
          styles.fieldSlot,
          fullWidthFields.includes(name) && styles.fieldSlotFull,
          tallFields.includes(name) && styles.fieldSlotTall,
        )}>
        <Field name={name} />
      </div>
    ))}
  </section>
);
