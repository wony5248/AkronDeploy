import { observable, makeObservable, action } from 'mobx';
import { isUndefined, dError } from '@akron/runner';
import { CSSInfo } from 'store/app/AppInfo';

/**
 * 앱에서 사용하는 스타일 관련 정보들을 보관합니다.
 *
 * - Import한 CSS 코드들
 * - 컴포넌트 종류별 default 스타일
 * - 테마
 * - ...
 *
 * 와 같은 정보들을 보관합니다.
 */
export default class AppStylesContainer {
  /**
   * 외부에서 가져온 CSS 코드들입니다.
   * key: 코드의 이름, value: CSS 파일의 URL
   */
  @observable
  private globalCSSMap: Map<string, CSSInfo>;

  /**
   * 생성자
   */
  public constructor() {
    makeObservable(this);
    this.globalCSSMap = new Map();
  }

  /**
   * Global CSS 목록 가져옴.
   */
  public getAllGlobalCSSs() {
    return Array.from(this.globalCSSMap.entries());
  }

  /**
   * Global CSS 목록 세팅.
   */
  @action
  public setAllGlobalCSSs(entries: Array<[string, CSSInfo]>) {
    this.globalCSSMap = new Map(entries);
  }

  /**
   * Global CSS 추가.
   */
  @action
  public setGlobalCSS(key: string, info: CSSInfo) {
    this.globalCSSMap.set(key, info);
  }

  /**
   * Global CSS 제거.
   */
  @action
  public deleteGlobalCSS(key: string) {
    this.globalCSSMap.delete(key);
  }

  /**
   * Global CSS 업데이트.
   */
  @action
  public updateGlobalCSS(key: string, getInfo: (prevInfo: CSSInfo) => CSSInfo) {
    const prevInfo = this.globalCSSMap.get(key);

    if (prevInfo === undefined) {
      dError(`CSS ${key}가 존재하지 않습니다!`);
      return;
    }

    this.globalCSSMap.set(key, getInfo(prevInfo));
  }
}
