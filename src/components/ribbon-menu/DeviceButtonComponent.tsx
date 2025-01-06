import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { deviceButton } from 'styles/ribbon-menu/DeviceButton';
import { getDeviceSize } from 'util/DeviceUtil';

/**
 * Device 정보 변경 버튼.
 */
const DeviceButtonComponent: React.FC = () => {
  const editorStore = useEditorStore();

  const deviceInfo = editorStore.getDeviceInfo();
  const deviceSize = getDeviceSize(deviceInfo);

  return (
    <button
      css={deviceButton}
      type={'button'}
      onClick={() => {
        // editorStore.setDialog(ribbonDialogContentMap.UpdateDevice, true);
      }}
    >
      {`${deviceInfo.deviceType !== 'Custom' ? deviceInfo.deviceName : 'Custom'} . ${deviceSize.width}*${
        deviceSize.height
      }`}
    </button>
  );
};

export default observer(DeviceButtonComponent);
