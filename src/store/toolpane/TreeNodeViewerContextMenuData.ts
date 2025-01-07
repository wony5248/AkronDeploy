import { ContextMenuProp } from 'store/context-menu/ContextMenuTypes';

export const ResourceContextMenuData: ContextMenuProp[] = [
  {
    id: 'TOOLPANE_RESOURCE_COPY_RESOURCE',
    variant: 'LargeMenuItem',
    mainText: '복사하기',
    subText: 'Ctrl + C',
    commandType: 'Resource',
    commandPropName: 'CopyResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_PASTE_RESOURCE',
    variant: 'LargeMenuItem',
    mainText: '붙여넣기',
    subText: 'Ctrl + V',
    commandType: 'Resource',
    commandPropName: 'PasteResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_CHANGE_NAME',
    variant: 'LargeDialogMenuItem',
    mainText: '이름 바꾸기',
    subText: 'Ctrl + R',
    commandType: 'Resource',
    commandPropName: 'RenameResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_MENU_GX_SEPARATOR1',
    variant: 'SeparatorItem',
  },
  {
    id: 'TOOLPANE_RESOURCE_MOVE_TOP_RESOURCE',
    variant: 'LargeMenuItem',
    mainText: '맨 앞으로 가져오기',
    subText: ']',
    commandType: 'Resource',
    commandPropName: 'MoveTopResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_MOVE_UP_RESOURCE',
    variant: 'LargeMenuItem',
    mainText: '앞으로 가져오기',
    subText: 'Ctrl + ]',
    commandType: 'Resource',
    commandPropName: 'MoveUpResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_MOVE_DOWN_RESOURCE',
    variant: 'LargeMenuItem',
    mainText: '뒤로 보내기',
    subText: 'Ctrl + [',
    commandType: 'Resource',
    commandPropName: 'MoveDownResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_MOVE_BOTTOM_RESOURCE',
    variant: 'LargeMenuItem',
    mainText: '맨 뒤로 보내기',
    subText: '[',
    commandType: 'Resource',
    commandPropName: 'MoveBottomResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_MENU_GX_SEPARATOR2',
    variant: 'SeparatorItem',
  },
  {
    id: 'TOOLPANE_RESOURCE_HIDE_UNHIDE',
    variant: 'LargeMenuItem',
    mainText: '컴포넌트 보이기 / 숨기기',
    commandType: 'Resource',
    commandPropName: 'HideUnhideResource',
  },
  {
    id: 'TOOLPANE_RESOURCE_LOCK_UNLOCK',
    variant: 'LargeMenuItem',
    mainText: '컴포넌트 잠금 / 풀기',
    commandType: 'Resource',
    commandPropName: 'LockUnlockResource',
  },
];

export default ResourceContextMenuData;
