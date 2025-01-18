import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { ribbonDialogContentMap } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import { deviceButton } from 'styles/ribbon-menu/DeviceButton';

/**
 * Device 정보 변경 버튼.
 */
const DeviceButtonComponent: React.FC = () => {
  const editorStore = useEditorStore();

  const currentPage = editorStore.getEditingPageModel();

  if (currentPage === undefined) {
    return <></>;
  }

  const deviceName =
    currentPage.getProperties().content['device'].value ?? currentPage.getProperties().content['device'].defaultValue;
  const pageWidth = currentPage.getStyleProperties('width').absolute;
  const pageHeight = currentPage.getStyleProperties('height').absolute;

  return (
    <button
      css={deviceButton}
      type={'button'}
      onClick={() => {
        editorStore.setDialog(ribbonDialogContentMap.UpdateDevice, true);
      }}
    >
      {`${deviceName} . ${pageWidth} * ${pageHeight}`}
    </button>
  );
};

export default observer(DeviceButtonComponent);
