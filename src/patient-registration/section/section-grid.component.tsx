import React from 'react';
import classNames from 'classnames';
import { Field } from '../field/field.component';
import styles from './generic-section.scss';

interface SectionGridProps {
  fields: Array<string>;
  /** Field names that always span the full width of the grid. */
  fullWidthFields?: ReadonlyArray<string>;
  'aria-label'?: string;
}

/**
 * Shared two-column field grid for the wide layout (see generic-section.scss).
 * Field order is preserved — no auto-flow reordering in a clinical form.
 */
export const SectionGrid = ({ fields, fullWidthFields = [], ...rest }: SectionGridProps) => (
  <section {...rest} className={styles.fieldsGrid}>
    {fields.map((name) => (
      <div key={name} className={classNames(styles.fieldSlot, fullWidthFields.includes(name) && styles.fieldSlotFull)}>
        <Field name={name} />
      </div>
    ))}
  </section>
);
