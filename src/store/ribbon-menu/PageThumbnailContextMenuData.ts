import { ContextMenuProp } from 'store/context-menu/ContextMenuTypes';

export const PageThumbnailContextMenuData: ContextMenuProp[] = [
  {
    id: 'TOOLPANE_PAGE_ADD_AREA',
    variant: 'SmallMenuItem',
    mainText: '구역 추가',
    commandType: 'Page',
    commandPropName: 'AddSection',
  },
  {
    id: 'RIB_PAGE_CONTEXT_SEPARATOR_1',
    variant: 'SeparatorItem',
  },
  {
    id: 'TOOLPANE_PAGE_ADD_PAGE',
    variant: 'SmallMenuItem',
    mainText: '새 페이지',
    commandType: 'Page',
    commandPropName: 'WIDGET_RESIZE_END',
  },
  {
    id: 'TOOLPANE_PAGE_DUPLICATE_PAGE',
    variant: 'SmallMenuItem',
    mainText: '페이지 복사 붙여넣기',
    commandType: 'Page',
    commandPropName: 'CopyPage',
  },
  {
    id: 'TOOLPANE_PAGE_CHANGE_NAME',
    variant: 'SmallDialogMenuItem',
    mainText: '페이지 이름 변경하기',
    commandType: 'Page',
    commandPropName: 'RenamePage',
  },
  {
    id: 'TOOLPANE_PAGE_UPDATE_LEVEL',
    variant: 'SmallDialogMenuItem',
    mainText: '페이지 레벨 수정하기',
    commandType: 'Page',
    commandPropName: 'UpdatePageLevel',
  },
  {
    id: 'TOOLPANE_PAGE_DELETE_PAGE',
    variant: 'SmallMenuItem',
    mainText: '페이지 삭제',
    commandType: 'Page',
    commandPropName: 'DeletePage',
  },
  {
    id: 'RIB_PAGE_CONTEXT_SEPARATOR_2',
    variant: 'SeparatorItem',
  },
  {
    id: 'TOOLPANE_PAGE_LOCK',
    variant: 'SmallMenuItem',
    mainText: '페이지 잠금/해제',
    commandType: 'Home',
    commandPropName: 'PageLock',
  },
];

export default PageThumbnailContextMenuData;
