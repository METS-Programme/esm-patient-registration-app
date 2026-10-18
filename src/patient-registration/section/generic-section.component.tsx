import React from 'react';
import classNames from 'classnames';
import { type SectionDefinition } from '../../config-schema';
import { Field } from '../field/field.component';
import styles from './generic-section.scss';

export interface GenericSectionProps {
  sectionDefinition: SectionDefinition;
}

// Fields that always span the full width of the section grid in the wide
// layout (identifier actions and the address search need the room).
const fullWidthFields: ReadonlyArray<string> = ['address', 'id'];

export const GenericSection = ({ sectionDefinition }: GenericSectionProps) => {
  return (
    <section aria-label={`${sectionDefinition.name} Section`} className={styles.fieldsGrid}>
      {sectionDefinition.fields.map((name) => (
        <div
          key={`${sectionDefinition.name}-${name}`}
          className={classNames(styles.fieldSlot, fullWidthFields.includes(name) && styles.fieldSlotFull)}>
          <Field name={name} />
        </div>
      ))}
    </section>
  );
};
