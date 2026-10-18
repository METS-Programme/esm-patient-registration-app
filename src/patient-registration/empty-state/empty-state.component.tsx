import { Layer, Tile } from '@carbon/react';
import styles from './empty-state.scss';
import EmptyStateIllustration from './empty-state-illustration.component';
import React from 'react';

export const EmptyStateComponent = () => {
  return (
    <Layer className={styles.layer}>
      <Tile className={styles.tile}>
        <EmptyStateIllustration />
        <p className={styles.content}>No Records Found</p>
        <p className={styles.explainer}></p>
      </Tile>
    </Layer>
  );
};
