import { observable, makeObservable, action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { createContext } from 'react';
import {
  ContextMenu,
  ContextMenuProp,
  LandingPageContextMenu,
  LandingPageContextMenuProp,
  IContextMenuPosition,
} from 'store/context-menu/ContextMenuTypes';

/**
 * Context menu에 필요한 내용을 관리합니다.
 */
class ContextMenuContainer {
  /**
   * Context menu에 필요한 값들을 저장합니다.
   */
  @observable
  private contextMenu: ContextMenu | LandingPageContextMenu;

  /**
   * SubContext menu에 필요한 값들을 저장합니다.
   * 현재는 SubContext menu에 대한 요구사항이 없어, 미사용합니다.
   */
  @observable
  private subContextMenu: ContextMenu | LandingPageContextMenu;

  @observable
  private args: unknown[] = [];

  /**
   * Context menu를 사용하기 위한 값의 초기값을 설정합니다.
   */
  public constructor() {
    makeObservable(this);
    this.contextMenu = {
      data: undefined,
      isOpen: false,
      position: {
        top: 0,
        left: 0,
      },
    };
    this.subContextMenu = {
      data: undefined,
      isOpen: false,
      position: {
        top: 0,
        left: 0,
      },
    };
  }

  /**
   * Context menu에 필요한 추가적 정보를 설정합니다.
   */
  @action.bound
  public setArgs(...args: unknown[]) {
    this.args = args;
  }

  /**
   * Context menu에 필요한 추가적 정보를 가져옵니다.
   */
  public getArgs() {
    return this.args;
  }

  /**
   * Context menu에 대한 정보를 가져옵니다.
   */
  public getContextMenu(): ContextMenu | LandingPageContextMenu {
    return this.contextMenu;
  }

  /**
   * SubContext menu에 대한 정보를 가져옵니다.
   */
  public getSubContextMenu(): ContextMenu | LandingPageContextMenu {
    return this.subContextMenu;
  }

  /**
   * Context menu에 삽입될 데이터를 설정합니다.
   *
   * @param data 해당 데이터는 다른 ContextMenuData.ts를 참조해주세요.
   */
  @action.bound
  public setContextMenuContent(data: ContextMenuProp[] | LandingPageContextMenuProp[]): void {
    this.contextMenu.data = data;
  }

  /**
   * Context menu를 마운트합니다. 위치가 고정 되어야 할 경우 position 값을 별도로 전달 받아 사용합니다.
   *
   * @param event onCotextMenu의 마우스 이벤트
   * @param data Context menu에 삽입될 데이터
   * @param parentElement 삽입될 부모 컴포넌트, 디폴트 : root | body
   */
  @action.bound
  public openContextMenu(
    e: React.MouseEvent,
    data: ContextMenuProp[] | LandingPageContextMenuProp[],
    parentElement?: HTMLElement | null,
    position?: IContextMenuPosition
  ): void {
    e.preventDefault();
    e.stopPropagation();
    this.contextMenu.data = data;
    if (parentElement) {
      this.contextMenu.parentElement = parentElement;
    }
    this.contextMenu.isOpen = true;
    this.contextMenu.position = position ?? { top: e.clientY, left: e.clientX };
  }

  /**
   * SubContext menu를 마운트합니다.
   *
   * @param position SubContext menu가 노출될 위치
   * @param data Context menu에 삽입될 데이터
   */
  @action.bound
  public openSubContextMenu(
    position: { top: number; left: number },
    data?: ContextMenuProp[] | LandingPageContextMenuProp[]
  ): void {
    this.subContextMenu.isOpen = true;
    this.subContextMenu.position = position;
    this.subContextMenu.data = data;
  }

  /**
   * Context menu를 언마운트합니다.
   */
  @action.bound
  public closeContextMenu(): void {
    this.contextMenu.isOpen = false;
    this.contextMenu.parentElement = undefined;
    this.contextMenu.data = undefined;
  }

  /**
   * SubContext menu를 언마운트합니다.
   */
  @action.bound
  public closeSubContextMenu(): void {
    this.subContextMenu.isOpen = false;
    this.subContextMenu.data = undefined;
  }

  /**
   * Context menu와 SubContext menu를 언마운트합니다.
   */
  @boundMethod
  public closeAllContextMenu(): void {
    this.closeContextMenu();
    this.closeSubContextMenu();
  }

  /**
   * Context menu가 열려있다면 true 아니면 false를 반환합니다.
   */
  @boundMethod
  public isContextMenuOpened(): boolean {
    return this.contextMenu.isOpen === true;
  }
}

export const ContextMenuContext = createContext<ContextMenuContainer>({} as ContextMenuContainer);

export const ContextMenuProvider = ContextMenuContext.Provider;

export default ContextMenuContainer;
