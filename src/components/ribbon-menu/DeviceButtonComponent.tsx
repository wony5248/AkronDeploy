import { observer } from 'mobx-react-lite';
import { deviceButton } from 'styles/ribbon-menu/DeviceButton';

/**
 * Device 정보 변경 버튼.
 */
const DeviceButtonComponent: React.FC = () => {
  // const appStore = useEditorStore();

  // const deviceInfo = appStore.getDeviceInfo();
  // const deviceSize = getDeviceSize(deviceInfo);

  return (
    <button
      css={deviceButton}
      type={'button'}
      onClick={() => {
        // appStore.setDialog(ribbonDialogContentMap.UpdateDevice, true);
      }}
    >
      {/* {`${deviceInfo.deviceType !== 'Custom' ? deviceInfo.deviceName : 'Custom'} . ${deviceSize.width}*${
                deviceSize.height
            }`} */}
    </button>
  );
};

export default observer(DeviceButtonComponent);
