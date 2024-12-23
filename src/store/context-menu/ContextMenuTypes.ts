import { PropHandlerItem } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * ContextMenu의 위치
 */
export interface IContextMenuPosition {
  top: number;
  left: number;
}

/**
 * ContextMenu에 필요한 데이터
 */
export interface ContextMenu {
  isOpen: boolean;
  position: IContextMenuPosition;
  data?: ContextMenuProp[];
  parentElement?: HTMLElement;
}

/**
 * LandingPageContextMenu에 필요한 데이터
 */
export interface LandingPageContextMenu {
  isOpen: boolean;
  position: IContextMenuPosition;
  data?: LandingPageContextMenuProp[];
  parentElement?: HTMLElement;
}

/**
 * ContextMenu Item에 필요한 데이터
 * subContextMenu는 아직 필요 상황이 없어 미적용
 */
export interface ContextMenuProp extends PropHandlerItem {
  id: string;
  variant: ContextMenuItemVariantType;
  mainText?: string;
  subText?: string;
  commandType?: string;
  commandPropName?: string;
  disabled?: boolean;
}

/**
 * LandingPageContextMenu Item에 필요한 데이터
 * subContextMenu는 아직 필요 상황이 없어 미적용
 */
export interface LandingPageContextMenuProp {
  id: string;
  variant: LandingPageContextMenuItemVariantType;
  mainText?: string;
  subText?: string;
  disabled?: boolean;
  dialogName?: string;
  imageID?: string;
  onClick?: (...args: unknown[]) => void;
}

/**
 * ContextMenuItemVariant type
 */
export type ContextMenuItemVariantType =
  | 'SmallMenuItem'
  | 'SmallDialogMenuItem'
  | 'LargeMenuItem'
  | 'LargeDialogMenuItem'
  | 'SeparatorItem';

/**
 * LandingPageContextMenuItemVariant type
 */
export type LandingPageContextMenuItemVariantType =
  | 'LandingPageSmallMenuItem'
  | 'LandingPageLargeMenuItem'
  | 'LandingPageSmallDialogMenuItem'
  | 'LandingPageLargeDialogMenuItem'
  | 'LandingPageContextMenuSmallIconItemComponent'
  | 'LandingPageSeparatorItem';
