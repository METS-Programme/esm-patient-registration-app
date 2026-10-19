import React, { useCallback } from 'react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import styles from '../field.scss';

/**
 * Patient photo card. Lives outside the Full Name card — the photo is not
 * part of the name — and demographics renders it directly above the name
 * card. The slot (placeholder, add/edit button, captions) comes from the
 * capture-patient-photo extension.
 */
export const PhotoField = () => {
  const { setCapturePhotoProps, currentPhoto, setFieldTouched } = usePatientRegistrationContext();

  const onCapturePhoto = useCallback(
    (dataUri: string, photoDateTime: string) => {
      if (setCapturePhotoProps) {
        setCapturePhotoProps({
          imageData: dataUri,
          dateTime: photoDateTime,
        });
        setFieldTouched('photo', true, false);
      }
    },
    [setCapturePhotoProps, setFieldTouched],
  );

  return (
    <div className={styles.patientPhoto}>
      <ExtensionSlot name="capture-patient-photo-slot" state={{ onCapturePhoto, initialState: currentPhoto }} />
    </div>
  );
};
