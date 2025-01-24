import DialogComponent from 'components/controls/dialog/DialogComponent';
import useEditorStore from 'hooks/useEditorStore';
import * as React from 'react';
import { ChangeEvent } from 'react';
import { IDialogContentProps } from 'store/ribbon-menu/RibbonCommonTypes';
import { imageResource } from 'styles/ribbon-menu/dialog-content/UpdateNameDialog';

/**
 * 리본탭 '프로젝트 이름 변경' 버튼의 다이얼로그
 */
const RibbonUpdateNameDialogComponent: React.FC<IDialogContentProps> = (props: IDialogContentProps) => {
  const { open, handleClose } = props;
  const editorStore = useEditorStore();
  const app = editorStore.getAppModel();
  const appName = app?.getName();

  const [error, setError] = React.useState<string>('');
  const [name, setName] = React.useState(appName || '');

  const onClickOK = async (nameInput: string) => {
    const appID = editorStore.getAppID();
    const result: boolean = true; // await editorStore.updateAppName(appID, roomID, nameInput);

    if (!result) {
      setError('동일한 프로젝트 이름이 있습니다.');
      return;
    }
    app?.setName(nameInput);
    handleClose();
  };

  const handleError = (appName: string) => {
    if (appName.trim() === '') {
      return '빈 문자열은 입력할 수 없습니다.';
    }
    if (appName.length > 20) {
      return '앱 이름은 20자 이하로 제한합니다.';
    }
    const pattern = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/;
    if (!appName.match(pattern)) {
      return '특수문자 없이 작성해 주세요.';
    }
    return '';
  };

  const handleClearClick = () => {
    setName('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleOKClick = () => {
    const errorMessage = handleError(name);
    if (errorMessage === '') {
      onClickOK(name);
    } else {
      setError(errorMessage);
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={{ handler: handleClose }}
      title="프로젝트 이름 바꾸기"
      bottomProps={{
        primaryButtonHandler: handleOKClick,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <input id="outlined-start-adornment" value={name} onChange={handleInputChange} />
        <div onClick={handleClearClick}>
          {/* <ImageResourceComponent
                                        className={styles.imageResource}
                                        id={'IC_TOOLPANE_SEARCH_DELETE'}
                                        w={'28px'}
                                        h={'28px'}
                                    /> */}
          <button css={imageResource} style={{ width: '28px', height: '28px' }} />
        </div>
      </div>
    </DialogComponent>
  );
};

export default RibbonUpdateNameDialogComponent;
