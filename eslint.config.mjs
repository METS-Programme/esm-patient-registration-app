import openmrs from '@openmrs/eslint-config';

export default [
  { ignores: ['**/dist/**', '**/*.d.ts', '.yarn/**'] },
  ...openmrs,
  {
    rules: {
      // Rules this repo enforces that the shared config leaves off. The two
      // ban-types successors come from typescript-eslint's recommended preset,
      // which this repo was picking up before the migration.
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always', allowObjectTypes: 'always' }],
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
