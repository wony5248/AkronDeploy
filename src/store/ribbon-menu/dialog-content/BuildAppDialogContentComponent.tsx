import DialogComponent from 'components/controls/dialog/DialogComponent';
import useEditorStore from 'hooks/useEditorStore';
import AppRepository from 'models/repository/AppRepository';
import { ChangeEvent, ReactNode, useState } from 'react';
import { IRibbonDialogContentProps } from 'store/ribbon-menu/RibbonCommonTypes';

/**
 * 웹에서 가져온 이미지, 비디오 등을 삽입할 때 쓰는 dialog입니다.
 */
const BuildAppDialogContentComponent: React.FC<IRibbonDialogContentProps> = ({
  open,
  handleClose,
}: IRibbonDialogContentProps) => {
  const editorStore = useEditorStore();
  const editorUIStore = editorStore.getEditorUIStore();
  const [resultName, setResultName] = useState(editorStore.getAppModel()?.getName() ?? '');
  const [progress, setProgress] = useState<'None' | 'Running' | 'Done'>('None');
  const [log, setLog] = useState<string>('');
  const isCorrectName = resultName.length > 0;

  const titleID = '앱 빌드';

  let content: ReactNode = null;
  let footer = true;

  const handleClickOK = async () => {
    if (!isCorrectName) {
      editorUIStore.setEditorSnackBarMsg('빌드 앱 이름이 올바르지 않습니다.');
      return;
    }

    setProgress('Running');

    // await AppRepository.buildAppAndDownload(editorStore.getAppID(), resultName, newLog => {
    //     setLog(`${log}\n${newLog}`);
    // });

    await new Promise(r => setTimeout(r, 2000));

    setProgress('Done');
  };

  const handleChangeFolderName = (event: ChangeEvent<HTMLInputElement>) => {
    setResultName(event.target.value);
  };

  if (progress === 'None') {
    content = (
      <>
        <div>
          생성할 파일의 이름을 입력하세요.
          <br />
          해당 폴더 이름으로 앱 ZIP 파일이 생성됩니다.
        </div>
        <input type="text" value={resultName} onChange={handleChangeFolderName} />
      </>
    );
  } else if (progress === 'Running') {
    content = '생성 중...';
    footer = false;
  } else if (progress === 'Done') {
    content = '생성 완료!';
    footer = false;
  }

  return (
    <DialogComponent
      open={open}
      onClose={{ autoClose: false, handler: handleClose }}
      title={titleID}
      bottomProps={{
        primaryButtonHandler: progress === 'Done' ? handleClose : handleClickOK,
        secondaryButtonHandler: footer ? handleClose : undefined,
        secondaryButtonText: footer ? '취소' : undefined,
      }}
    >
      {content}
      <div
        style={{
          marginTop: '8px',
          whiteSpace: 'pre-wrap',
          opacity: 0.8,
        }}
      >
        {log}
      </div>
    </DialogComponent>
  );
};

export default BuildAppDialogContentComponent;
