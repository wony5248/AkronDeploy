import PortalComponent from 'components/common/PortalComponent';
import SaveCompleteMessageComponent from 'components/ribbon-menu/save-indicator/SaveCompleteMessageComponent';
import SaveErrorMessageComponent from 'components/ribbon-menu/save-indicator/SaveErrorMessageComponent';
import SaveErrorPageComponent from 'components/ribbon-menu/save-indicator/SaveErrorPageComponent';
import SaveLoading from 'components/ribbon-menu/save-indicator/SaveLoading';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { saveIcon } from 'styles/ribbon-menu/SaveIndicator';

/**
 * indicatorState의 Type
 */
type IndicatorType = 'SaveComplete' | 'SaveError';

/**
 * 우측 Ribbon Menu 구성 Component
 */
const SaveIndicatorComponent: React.FC = () => {
  const editorStore = useEditorStore();
  // const saveState = editorStore.getSaveState();
  const loadingTimer = useRef</*NodeJS.Timeout | */ number | null>();

  const [indicatorState, setIndicatorState] = useState<IndicatorType>('SaveComplete');
  const [showLoadingPage, setShowLoadingPage] = useState<boolean>(false);
  const [showErrorPage, setShowErrorPage] = useState<boolean>(false);
  const [messageShow, setMessageShow] = useState<boolean>(false);
  const [completeGif, setCompleteGif] = useState<null | boolean>(null);

  /**
   * 로딩화면을 표시 후,
   */
  const reSaving = () => {
    setMessageShow(false);
    if (!loadingTimer.current) {
      return;
    }
    clearTimeout(loadingTimer.current as number);
    loadingTimer.current = null;
    setShowLoadingPage(true);
    // editorStore.handleSave({ commandID: CommandEnum.SAVE });
  };

  /**
   * 로딩화면을 표시하기 위한 타이머 설정
   */
  const setLoadingTimer = () => {
    loadingTimer.current = setTimeout(() => {
      // editorStore.setSaveState(SaveState.RESAVING);
    }, 7000);
  };

  /**
   * save complete 시, 아이콘 변경
   */
  const setSaveComplete = () => {
    setTimeout(() => {
      setCompleteGif(false);
    }, 4700);
  };

  // useLayoutEffect(() => {
  //     if (saveState === SaveState.SAVE_ERROR) {
  //         setIndicatorState('SaveError');
  //         setLoadingTimer();
  //     } else if (saveState === SaveState.SAVE_COMPLETE) {
  //         if (showLoadingPage) setShowLoadingPage(false);
  //         if (showErrorPage) setShowErrorPage(false);
  //         setIndicatorState('SaveComplete');
  //         if (completeGif === null) setCompleteGif(false);
  //         else setCompleteGif(true);
  //     } else if (saveState === SaveState.RESAVING) {
  //         reSaving();
  //     } else if (saveState === SaveState.RESAVE_ERROR) {
  //         setShowLoadingPage(false);
  //         setShowErrorPage(true);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [saveState]);

  return (
    <div>
      {showLoadingPage && (
        <PortalComponent parentElement={document.getElementById('workarea')}>
          <SaveLoading />
        </PortalComponent>
      )}
      {showErrorPage && (
        <PortalComponent parentElement={document.getElementById('ribbonMenu')}>
          <SaveErrorPageComponent />
        </PortalComponent>
      )}
      {indicatorState === 'SaveComplete' && (
        <>
          <div
            css={saveIcon}
            onClick={() => {
              setMessageShow(true);
            }}
          >
            {completeGif ? (
              <img
                src={'' /*IcAutosavecomplete*/}
                alt="SAVE_COMPLETE"
                onLoad={setSaveComplete}
                width={'32px'}
                height={'32px'}
              />
            ) : (
              // <ImageResourceComponent id={'IC_AUTOSAVECOMPLETE'} w={'32px'} h={'32px'} />
              <button style={{ width: '32px', height: '32px' }} />
            )}
          </div>
          <SaveCompleteMessageComponent setMessageShow={setMessageShow} messageShow={messageShow} />
        </>
      )}
      {indicatorState === 'SaveError' && (
        <>
          {/* <ImageResourceComponent id={'IC_TOP_AUTOSAVEFAIL'} w={'32px'} h={'32px'} /> */}
          <button style={{ width: '32px', height: '32px' }} />
          <SaveErrorMessageComponent />
        </>
      )}
    </div>
  );
};

export default observer(SaveIndicatorComponent);
