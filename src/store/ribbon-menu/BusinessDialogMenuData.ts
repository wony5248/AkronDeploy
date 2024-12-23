import { IRibbonButton } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * BusinessDialogMenuData
 * UI 나오기 전 임시 버튼입니다
 */
const BusinessDialogMenuData: IRibbonButton = {
  type: 'dropdown',
  label: '다이얼로그',
  image: 'IC_MENU_PAGE',
  childList: [
    {
      id: 'RIB_DIALOG_LIST',
      label: '다이얼로그 목록',
      type: 'DialogMenuItem',
      image: 'IC_PAGE_ADD',
      commandPropName: 'businessDialogListDialog',
      commandType: 'BusinessDialogComponent',
    },
    {
      id: 'RIB_DIALOG_REGISTER',
      label: '다이얼로그 등록',
      type: 'DialogMenuItem',
      image: 'IC_PAGE_ADD',
      commandPropName: 'RegisterBusinessDialogComponent',
      commandType: 'BusinessDialogComponent',
    },
    {
      id: 'RIB_DIALOG_CLOSE',
      label: '나가기',
      type: 'DialogMenuItem',
      image: 'IC_PAGE_ADD',
      commandPropName: 'CloseBusinessDialogEditMode',
      commandType: 'BusinessDialogComponent',
    },
  ],
};

export default BusinessDialogMenuData;
