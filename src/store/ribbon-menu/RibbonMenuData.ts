import BusinessDialogMenuData from 'store/ribbon-menu/BusinessDialogMenuData';
import PageMenuData from 'store/ribbon-menu/PageMenuData';
import ProjectMenuData from 'store/ribbon-menu/ProjectMenuData';
import RibbonButtonData from 'store/ribbon-menu/RibbonButtonData';
import { IRibbonButton } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * UX Ribbon을 구성하는 Data
 */
const RibbonButtonDataList: IRibbonButton[] = [
  ProjectMenuData,
  // PageMenuData,
  // BusinessDialogMenuData,
  // ...RibbonButtonData,
];

// /**
//  * GX Ribbon을 구성하는 Data
//  */
// const GXRibbonButtonDataList: IRibbonButton[] = [FileMenuData, ComponentMenuData, ...GXRibbonButtonData];

// /**
//  * GX Ribbon을 구성하는 Data
//  */
// export const menuDataButtonMap: Record<AppType, IRibbonButton[]> = {
//     UX: UXRibbonButtonDataList,
//     GX: GXRibbonButtonDataList,
// };

export default RibbonButtonDataList;
