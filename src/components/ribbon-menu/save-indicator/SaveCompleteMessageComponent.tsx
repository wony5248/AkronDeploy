import ImageResourceComponent from 'components/common/ImageResourceComponent';
import useEditorStore from 'hooks/useEditorStore';
import { useLayoutEffect, useState } from 'react';
import { lastSavedTime, saveMessageContainer } from 'styles/ribbon-menu/SaveIndicator';

/**
 * SaveCompleteMessage를 나타내는 component props.
 */
interface IProps {
  setMessageShow: (value: boolean) => void;
  messageShow: boolean;
}

/**
 * SaveCompleteMessage 구성 Component
 */
const SaveCompleteMessageComponent: React.FC<IProps> = ({ setMessageShow, messageShow }: IProps) => {
  const editorStore = useEditorStore();
  const [lastSaveTime, setLastSaveTime] = useState<string>('');
  /**
   * 프로젝트 저장시간 형태변형
   */
  const getLastSavedTime = () => {
    // const getSavedTime = editorStore.getFormChangeLastSavedTime();
    // if (getSavedTime) setLastSaveTime(getSavedTime);
    // else setMessageShow(false);
  };

  useLayoutEffect(() => {
    getLastSavedTime();
  });

  return (
    <div
      css={[saveMessageContainer, 'forComplete']}
      style={{
        visibility: messageShow ? 'visible' : 'hidden',
      }}
    >
      <ImageResourceComponent id={'IC_DIALOG_AUTOSAVECOMPLETE'} w={'24px'} h={'24px'} />
      {lastSaveTime && <div css={[lastSavedTime, 'forComplete']}>최근 저장 시간 : {lastSaveTime}</div>}
      <div
        onClick={() => {
          setMessageShow(false);
        }}
      >
        <ImageResourceComponent id={'IC_POPUP_CLOSE_SEARCH'} w={'16px'} h={'16px'} />
      </div>
    </div>
  );
};

export default SaveCompleteMessageComponent;
