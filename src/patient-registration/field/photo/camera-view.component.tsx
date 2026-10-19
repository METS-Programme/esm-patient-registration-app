import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from '../field.scss';

interface CameraViewProps {
  onCapture: (dataUri: string) => void;
  onClose: () => void;
}

/**
 * Live camera view rendered inside the photo frame. Grabs a still from the
 * device camera (front-facing by default, for patient portraits) and hands
 * the JPEG data URI to the caller. getUserMedia requires a secure context —
 * on plain-HTTP deployments this reports the error inline and the file
 * picker remains the fallback.
 */
export const CameraView = ({ onCapture, onClose }: CameraViewProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t('cameraUnavailable', 'Camera is not available in this browser'));
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() =>
        setError(
          t(
            'cameraPermissionError',
            'Unable to access the camera. Check that camera permissions are granted and the page is served over HTTPS.',
          ),
        ),
      );

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [t]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video?.videoWidth) {
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg', 0.9));
  }, [onCapture]);

  if (error) {
    return (
      <div className={styles.cameraMessage} role="alert">
        <p className={styles.cameraMessageText}>{error}</p>
        <Button kind="ghost" onClick={onClose}>
          {t('close', 'Close')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.cameraView}>
      <video ref={videoRef} autoPlay muted playsInline className={styles.cameraPreview} />
      <div className={styles.cameraControls}>
        <Button kind="ghost" onClick={onClose}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button onClick={capture}>{t('takePhoto', 'Take photo')}</Button>
      </div>
    </div>
  );
};
