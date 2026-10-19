import React, { useCallback, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from '@carbon/react';
import { Attachment, Camera, Image as ImageIcon } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { toOmrsIsoString } from '@openmrs/esm-framework';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import { CameraView } from './camera-view.component';
import styles from '../field.scss';

const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png'];

/**
 * Patient photo card: a fluid preview that fills the card's width (and so
 * scales with the device) above the capture controls — live camera or file
 * attachment. Photos captured either way flow through the same pipeline as
 * before — setCapturePhotoProps on the registration context — so
 * persistence behavior is unchanged.
 */
export const PhotoField = () => {
  const { t } = useTranslation();
  const { setCapturePhotoProps, currentPhoto, setFieldTouched } = usePatientRegistrationContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // A photo chosen or captured in this session, shown immediately; the
  // saved photo (edit mode) arrives via currentPhoto.
  const [pendingPhoto, setPendingPhoto] = useState<string | undefined>();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const shownPhoto = pendingPhoto ?? currentPhoto;

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

  const onCameraCapture = useCallback(
    (dataUri: string) => {
      setCameraOpen(false);
      setPendingPhoto(dataUri);
      onCapturePhoto(dataUri, toOmrsIsoString(new Date()));
    },
    [onCapturePhoto],
  );

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still fires change.
    event.target.value = '';
    if (!file) {
      return;
    }

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setError(t('photoTypeError', 'Photo must be a JPG or PNG'));
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setError(t('photoSizeError', 'Photo must be 2 MB or smaller'));
      return;
    }

    setError(undefined);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      setPendingPhoto(dataUri);
      onCapturePhoto(dataUri, toOmrsIsoString(new Date()));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.patientPhoto}>
      <div className={styles.photoFrame}>
        {cameraOpen ? (
          <CameraView onCapture={onCameraCapture} onClose={() => setCameraOpen(false)} />
        ) : shownPhoto ? (
          <img className={styles.photoImage} src={shownPhoto} alt={t('patientPhotoAlt', 'Patient photo')} />
        ) : (
          <div className={styles.photoPlaceholder}>
            <ImageIcon size={48} aria-hidden="true" className={styles.photoPlaceholderIcon} />
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_PHOTO_TYPES.join(',')}
        className={styles.hiddenFileInput}
        onChange={onFileChange}
        aria-label={t('patientPhotoAlt', 'Patient photo')}
      />
      {cameraOpen ? null : (
        <div className={styles.photoActions}>
          <Button kind="ghost" renderIcon={Camera} onClick={() => setCameraOpen(true)}>
            {shownPhoto ? t('retakePhoto', 'Retake photo') : t('takePhoto', 'Take photo')}
          </Button>
          <Button kind="ghost" renderIcon={Attachment} onClick={() => fileInputRef.current?.click()}>
            {shownPhoto ? t('changePhoto', 'Change photo') : t('addPhoto', 'Add photo')}
          </Button>
        </div>
      )}
      {!cameraOpen && (
        <span className={styles.photoCaption}>{t('photoRequirementsCaption', 'JPG or PNG, max 2 MB')}</span>
      )}
      {error && !cameraOpen && (
        <span className={styles.photoError} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
