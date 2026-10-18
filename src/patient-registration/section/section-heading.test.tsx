import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeading } from './section-heading.component';

describe('SectionHeading', () => {
  it('numbers the section and shows the required-fields caption', () => {
    render(<SectionHeading index={2} title="Contact Details" />);

    expect(screen.getByText('3.')).toBeInTheDocument();
    expect(screen.getByText(/Contact Details/)).toBeInTheDocument();
    expect(screen.getByText(/all fields are required unless marked optional/i)).toBeInTheDocument();
  });

  it('does not render an action when no action is provided', () => {
    render(<SectionHeading index={0} title="Basic Info" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders an action in the heading row when provided', () => {
    render(<SectionHeading index={3} title="Relationships" action={<button>Add relationship</button>} />);

    expect(screen.getByRole('button', { name: 'Add relationship' })).toBeInTheDocument();
  });
});
