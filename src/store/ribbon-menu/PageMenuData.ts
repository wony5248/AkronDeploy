import { IRibbonButton } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import SectionDropdownMenuData from 'store/ribbon-menu/SectionDropdownMenuData';

/**
 * Page Menu Data
 */
const PageMenuData: IRibbonButton = {
  type: 'dropdown',
  label: '페이지',
  image: 'IC_MENU_PAGE',
  childList: [
    {
      id: 'RIB_PAGE_ADD_PAGE',
      label: '페이지 추가',
      type: 'NormalMenuItem',
      image: 'IC_PAGE_ADD',
      commandPropName: 'AddPage',
      commandType: 'Page',
    },
    {
      id: 'RIB_PAGE_DELETE_PAGE',
      label: '페이지 삭제',
      type: 'NormalMenuItem',
      image: 'IC_PAGE_DELETE',
      commandPropName: 'DeletePage',
      commandType: 'Page',
    },
    {
      id: 'TOOLPANE_PAGE_CHANGE_NAME',
      label: '페이지 이름 바꾸기',
      type: 'DialogMenuItem',
      image: 'IC_PAGE_NAMEEDIT',
      commandType: 'Page',
      commandPropName: 'RenamePage',
    },
    {
      id: 'RIB_PAGE_SECTION_DROPDOWN',
      label: '구역',
      type: 'SubMenuItem',
      image: 'IC_L_TOOLPANE_PAGES_AREA',
      childList: SectionDropdownMenuData,
    },
  ],
};

export default PageMenuData;
