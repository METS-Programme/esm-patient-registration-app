import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { PhotoField } from './photo-field.component';
import { PatientRegistrationContextProvider } from '../../patient-registration-context';

function renderPhotoField(currentPhoto = '') {
  const setCapturePhotoProps = vi.fn();
  const setFieldTouched = vi.fn().mockResolvedValue(undefined);

  render(
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>
        <PatientRegistrationContextProvider
          value={
            {
              setCapturePhotoProps,
              setFieldTouched,
              currentPhoto,
            } as any
          }>
          <PhotoField />
        </PatientRegistrationContextProvider>
      </Form>
    </Formik>,
  );

  return { setCapturePhotoProps, setFieldTouched };
}

describe('PhotoField', () => {
  it('renders the placeholder and add control when no photo exists', () => {
    renderPhotoField();

    expect(screen.getByRole('button', { name: /add photo/i })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /patient photo/i })).not.toBeInTheDocument();
  });

  it('shows the existing photo with a change control in edit mode', () => {
    renderPhotoField('data:image/png;base64,abc');

    expect(screen.getByRole('img', { name: /patient photo/i })).toHaveAttribute('src', 'data:image/png;base64,abc');
    expect(screen.getByRole('button', { name: /change photo/i })).toBeInTheDocument();
  });

  it('rejects files that are not JPG or PNG without invoking the capture pipeline', () => {
    const { setCapturePhotoProps } = renderPhotoField();

    const input = screen.getByLabelText(/patient photo/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(['x'], 'photo.gif', { type: 'image/gif' })] } });

    expect(screen.getByRole('alert')).toHaveTextContent(/jpg or png/i);
    expect(setCapturePhotoProps).not.toHaveBeenCalled();
  });

  it('offers camera capture and reports when getUserMedia is unavailable', async () => {
    const originalMediaDevices = navigator.mediaDevices;
    Object.defineProperty(navigator, 'mediaDevices', { value: undefined, configurable: true });

    renderPhotoField();
    fireEvent.click(screen.getByRole('button', { name: /take photo/i }));

    // The capture controls are replaced by the camera view, which degrades
    // to an inline message when getUserMedia is unsupported (happy-dom).
    expect(await screen.findByRole('alert')).toHaveTextContent(/camera is not available/i);
    expect(screen.queryByRole('button', { name: /add photo/i })).not.toBeInTheDocument();

    Object.defineProperty(navigator, 'mediaDevices', { value: originalMediaDevices, configurable: true });
  });

  it('rejects oversized files without invoking the capture pipeline', () => {
    const { setCapturePhotoProps } = renderPhotoField();
    const bigFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'photo.png', { type: 'image/png' });
    Object.defineProperty(bigFile, 'size', { value: 3 * 1024 * 1024 });

    const input = screen.getByLabelText(/patient photo/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(screen.getByRole('alert')).toHaveTextContent(/2 mb or smaller/i);
    expect(setCapturePhotoProps).not.toHaveBeenCalled();
  });
});
