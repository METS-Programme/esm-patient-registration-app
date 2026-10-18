import React from 'react';
import { type SectionDefinition } from '../../config-schema';
import { SectionGrid } from './section-grid.component';

export interface GenericSectionProps {
  sectionDefinition: SectionDefinition;
}

export const GenericSection = ({ sectionDefinition }: GenericSectionProps) => {
  return <SectionGrid aria-label={`${sectionDefinition.name} Section`} fields={sectionDefinition.fields} />;
};
