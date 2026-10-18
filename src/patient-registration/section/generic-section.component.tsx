import React from 'react';
import { type SectionDefinition } from '../../config-schema';
import { SectionGrid } from './section-grid.component';

export interface GenericSectionProps {
  sectionDefinition: SectionDefinition;
}

// Fields that always span the full width of the section grid in the wide
// layout (identifier actions and the address search need the room).
const fullWidthFields: ReadonlyArray<string> = ['address', 'id'];

export const GenericSection = ({ sectionDefinition }: GenericSectionProps) => {
  return (
    <SectionGrid
      aria-label={`${sectionDefinition.name} Section`}
      fields={sectionDefinition.fields}
      fullWidthFields={fullWidthFields}
    />
  );
};
