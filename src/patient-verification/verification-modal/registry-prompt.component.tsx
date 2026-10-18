import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';

interface PostToRegistryPromptProps {
  onConfirm: () => void;
  close: () => void;
  registry: string;
}

const PostToRegistryPrompt: React.FC<PostToRegistryPromptProps> = ({ close, onConfirm, registry }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="cds--modal-header">
        <h3 className="cds--modal-header__heading">Post to {registry.length ? registry : 'registry'}</h3>
      </div>
      <div className="cds--modal-content">
        <p>Do you want to save patient in {registry}?</p>
      </div>
      <div className="cds--modal-footer">
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button onClick={onConfirm}>{t('postToRegistry', 'Post to Registry')}</Button>
      </div>
    </>
  );
};

export default PostToRegistryPrompt;
