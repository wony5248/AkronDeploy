import { IRibbonButton } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * Page Menu Data
 */
const RibbonButtonData: IRibbonButton[] = [
  {
    label: '데이터',
    image: 'IC_MENU_DATA',
    commandType: 'Home',
    commandPropName: 'ConvertDataTab',
  },
  {
    label: 'OS 기능',
    image: 'IC_MENU_OS',
    commandType: 'Home',
    commandPropName: 'OSobjectTab',
  },
];

export default RibbonButtonData;
