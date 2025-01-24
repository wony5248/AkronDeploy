import { dLog, isDefined } from '@akron/runner';
import DialogComponent from 'components/controls/dialog/DialogComponent';
import useEditorStore from 'hooks/useEditorStore';
import { ICreateFileOutput } from 'models/repository/AppRepository';
import * as React from 'react';
import NotificationDialogContentComponent from 'store/ribbon-menu/dialog-content/NotificationDialogContentComponent';
import { IRibbonDialogContentProps } from 'store/ribbon-menu/RibbonCommonTypes';

const SaveAsDialogContentComponent: React.FC<IRibbonDialogContentProps> = (props: IRibbonDialogContentProps) => {
  const { open, handleClose, commandPropName, commandType, onClick } = props;
  const editorStore = useEditorStore();

  const [error, setError] = React.useState<string>('');

  const onErrorDialogClose = () => {
    setError('');
  };

  const titleID = '다른 이름으로 저장';

  const [name, setName] = React.useState(editorStore.getAppModel()?.getName() ?? '');
  const isNameValid = name.length > 0;

  const onClickOK = async () => {
    dLog('onClicked save as');
    if (!isNameValid) {
      editorStore.getEditorUIStore().setEditorSnackBarMsg('프로젝트 이름을 입력해주세요');
      return;
    }

    const device = editorStore.getEditingPageModel()?.getProperties().content['device'];
    // const apiInput: ICreateAppInput = {
    //     appType: editorStore.getAppType(),
    //     appID: editorStore.getAppID(),
    //     appName: name,
    //     userID: editorStore.getUserID(),
    //     roomID: editorStore.getRoomID(),
    //     ...deviceInfo,
    // };

    const newApp: ICreateFileOutput = {
      appID: 2,
      appName: name,
      userID: 0,
      error: undefined,
    }; // await AppRepository.saveAppAs(apiInput);

    if (isDefined(newApp.error)) {
      setError(newApp.error);
      return;
    }

    editorStore.getEditorUIStore().setEditorSnackBarMsg(`'${newApp.appName}'을(를) 저장했습니다.`);
    handleClose();
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  return (
    <DialogComponent
      open={open}
      onClose={{ autoClose: false, handler: handleClose }}
      title={titleID}
      bottomProps={{
        primaryButtonHandler: onClickOK,
      }}
    >
      <div>프로젝트 이름</div>
      <input autoFocus value={name} onChange={onChangeName} />
      <NotificationDialogContentComponent
        open={Boolean(error)}
        handleClose={onErrorDialogClose}
        propsPlainContent={error}
        onClick={handleClose}
      />
    </DialogComponent>
  );
};

export default SaveAsDialogContentComponent;
