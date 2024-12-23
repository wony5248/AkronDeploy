import PortalComponent from 'components/common/PortalComponent';
import useEditorStore from 'hooks/useEditorStore';
import { useLayoutEffect, useState } from 'react';
import {
  lastSavedTime,
  popover,
  reloadButton,
  reloadButtonContainer,
  saveMessageContainer,
  saveMessageText,
  saveMessageTitle,
} from 'styles/ribbon-menu/SaveIndicator';

/**
 * SaveErrorMessage 구성 Component
 */
const SaveErrorMessageComponent: React.FC = () => {
  const editorStore = useEditorStore();
  // const saveState = editorStore.getSaveState();
  const [lastSaveTime, setLastSaveTime] = useState<string>('');
  const [messageOpen, setMessageOpen] = useState<boolean>(true);

  /**
   * 프로젝트 저장시간 형태변형
   */
  const getLastSavedTime = () => {
    // setLastSaveTime(editorStore.getFormChangeLastSavedTime());
  };

  /**
   * errorMessage close
   */
  const closeMessage = () => {
    setMessageOpen(false);
    // editorStore.setSaveState(SaveState.RESAVING);
  };

  useLayoutEffect(() => {
    getLastSavedTime();
  });

  // useEffect(() => {
  //     if (saveState === SaveState.RESAVE_ERROR || saveState === SaveState.RESAVING) setMessageOpen(false);
  // }, [saveState]);

  return (
    <>
      <PortalComponent parentElement={document.getElementById('root')}>
        <div
          css={popover}
          onWheel={() => {
            // editorStore.setSaveState(SaveState.RESAVING);
          }}
          onClick={() => {
            // editorStore.setSaveState(SaveState.RESAVING);
          }}
        >
          <div css={[saveMessageContainer, 'forError']} style={{ visibility: messageOpen ? 'visible' : 'hidden' }}>
            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'start' }}>
              {/* <ImageResourceComponent id={'IC_DIALOG_AUTOSAVEFAIL'} w={'24px'} h={'24px'} /> */}
              <button style={{ width: '24px', height: '24px' }} />
              <div style={{ margin: '0px 12px 16px 12px' }}>
                <div css={saveMessageTitle}>저장 실패</div>
                <div css={saveMessageText}>새로고침(F5)을 누르거나 앱을 다시 실행하세요.</div>
                {lastSaveTime && <div css={[lastSavedTime, 'forError']}>마지막 저장 시간 : {lastSaveTime}</div>}
              </div>
              <div
                onClick={e => {
                  e.stopPropagation();
                  closeMessage();
                }}
              >
                {/* <ImageResourceComponent id={'IC_POPUP_CLOSE_SEARCH'} w={'16px'} h={'16px'} /> */}
                <button style={{ width: '16px', height: '16px' }} />
              </div>
            </div>
            <div css={reloadButtonContainer}>
              <div
                css={reloadButton}
                onClick={e => {
                  e.stopPropagation();
                  window.location.reload();
                }}
              >
                새로고침 (F5)
              </div>
            </div>
          </div>
        </div>
      </PortalComponent>
    </>
  );
};

export default SaveErrorMessageComponent;
