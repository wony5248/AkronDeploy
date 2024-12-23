import { boundMethod } from 'autobind-decorator';
import { action, observable, makeObservable } from 'mobx';

export const appModeTypeNames = [
  'EDIT_APP', // common
  'EDIT_DIALOG_WIDGET', // ux
  'PAGE_LIST', // ux
  'RUNTIME_PREVIEW', // common
  'RUNTIME', // ux
] as const;

/**
 * 앱 모드들에 대한 type입니다.
 */
export type AppModeType = (typeof appModeTypeNames)[number];

/**
 * 편집 가능한 앱 모드들에 대한 type입니다.
 */
export type EditableMode = Extract<AppModeType, 'EDIT_APP' | 'EDIT_DIALOG_WIDGET'>;

/**
 * Runtime 관련 앱 모드들에 대한 type입니다.
 */
export type RuntimeBasedMode = Extract<AppModeType, 'RUNTIME_PREVIEW' | 'RUNTIME'>;

/**
 * 앱 모드와 관련된 정보를 담는 컨테이너입니다.
 */
class AppModeContainer {
  /**
   * 현재 앱 모드를 나타냅니다.
   */
  @observable
  private appMode: AppModeType;

  /**
   * 이전 상태의 앱 모드를 나타냅니다.
   */
  private previousAppMode: AppModeType;

  /**
   * 생성자입니다.
   *
   * @param isHighLevel High-Level Studio 여부
   * @param appMode 앱 모드
   */
  public constructor(appMode?: AppModeType) {
    makeObservable(this);
    this.appMode = appMode ?? 'EDIT_APP';
    this.previousAppMode = appMode ?? 'EDIT_APP';
  }

  /**
   * 현재 앱 모드를 반환합니다.
   *
   * @returns 현재 앱 모드
   */
  @boundMethod
  public getAppMode(): AppModeType {
    return this.appMode;
  }

  /**
   * 현재 앱 모드를 설정합니다.
   *
   * @param appMode 설정할 앱 모드
   */
  @action.bound
  public setAppMode(appMode: AppModeType): void {
    this.appMode = appMode;
  }

  /**
   * 이전 상태의 앱 모드를 반환합니다.
   *
   * @returns 이전 상태의 앱 모드
   */
  @boundMethod
  public getPreviousAppMode(): AppModeType {
    return this.previousAppMode;
  }

  /**
   * 이전 상태의 앱 모드를 설정합니다.
   *
   * @param previousAppMode 설정할 앱 모드
   */
  @boundMethod
  public setPreviousAppMode(previousAppMode: AppModeType): void {
    this.previousAppMode = previousAppMode;
  }
}

export default AppModeContainer;
