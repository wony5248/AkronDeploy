import { isNull } from '@akron/runner';
import DialogBottomComponent from 'components/controls/dialog/DialogBottomComponent';
import DialogComponent from 'components/controls/dialog/DialogComponent';
import DialogContentComponent from 'components/controls/dialog/DialogContentComponent';
import { Tab, Tabs } from 'components/controls/TabComponent';
import TextFieldComponent from 'components/controls/TextFieldComponent';
import useEditorStore from 'hooks/useEditorStore';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { UpdateDeviceInfoCommandProps } from 'models/store/command/handler/AppCommandHandler';
import { CSSProperties, useState } from 'react';
import { IRibbonDialogContentProps } from 'store/ribbon-menu/RibbonCommonTypes';
import {
  activeTab,
  deviceButton,
  deviceCustomLabel,
  deviceNameLabel,
  deviceSizeLabel,
  deviceTabContainer,
  deviceTextField,
  multiplyText,
  listItem,
  tab,
  tabView,
  listStyle,
} from 'styles/ribbon-menu/DeviceDialog';
import { tabLabel } from 'styles/toolpane/ComponentInsertToolpane';
import { DeviceSizeMap } from 'util/DeviceUtil';

/**
 * Orientation의 Type 입니다.
 */
type OrientationType = 'vertical' | 'horizontal';

/**
 * UpdateDevice content props
 */
interface IProps extends Pick<IRibbonDialogContentProps, 'open' | 'handleClose' | 'onClick'> {
  mode?: string;
}

const UpdateDeviceDialogContentComponent: React.FC<IProps> = (props: IProps) => {
  const { open, handleClose, onClick, mode } = props;
  const editorStore = useEditorStore();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedDize, setSelectedSize] = useState<number[]>([]);
  const [selectedDeviceName, setSelecedDeviceName] = useState('');

  const handleTabChange = (newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const selectDeviceSize = (deviceName: string, size: number[]) => {
    setSelecedDeviceName(deviceName);
    setSelectedSize(size);
  };

  const setDeviceSize = () => {
    const commandProps: UpdateDeviceInfoCommandProps = {
      commandID: CommandEnum.UPDATE_DEVICE_INFO,
      deviceName: selectedDeviceName,
      size: selectedDize,
    };
    editorStore.handleCommandEvent(commandProps);
  };

  const MobileListComponent = () => {
    const mobileMap = DeviceSizeMap.get('Mobile') as Map<string, number[]>;
    return (
      <ul css={listStyle}>
        {[...mobileMap].map(([key, value]) => (
          <li key={key} css={listItem(key === selectedDeviceName)} onClick={() => selectDeviceSize(key, value)}>
            {key}
          </li>
        ))}
      </ul>
    );
  };

  const DesktopListComponent = () => {
    const desktopMap = DeviceSizeMap.get('Desktop') as Map<string, number[]>;
    return (
      <ul css={listStyle}>
        {[...desktopMap].map(([key, value]) => (
          <li key={key} css={listItem(key === selectedDeviceName)} onClick={() => selectDeviceSize(key, value)}>
            {key}
          </li>
        ))}
      </ul>
    );
  };

  const tabStyle: CSSProperties = {
    minWidth: 0,
    width: 'auto',
    paddingLeft: '8px',
    paddingRight: '8px',
    margin: 0,
    fontSize: '12px',
  };
  return (
    <DialogComponent
      open={open}
      onClose={{ handler: handleClose }}
      title="디바이스 선택"
      bottomProps={{
        primaryButtonHandler: setDeviceSize,
      }}
    >
      <Tabs style={{ margin: '0 16px 0 16px', background: 'white' }} value={tabIndex} onChange={handleTabChange}>
        <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 0)}>Mobile</span>} />
        <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 1)}>Desktop</span>} />
      </Tabs>
      {tabIndex === 0 && MobileListComponent()}
      {tabIndex === 1 && DesktopListComponent()}
    </DialogComponent>
  );
};

export default UpdateDeviceDialogContentComponent;
