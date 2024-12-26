/**
 * Import한 CSS 파일 정보.
 */
export interface CSSInfo {
  code: string;
  // 파일 크기. (Bytes)
  size: number;
  // 만든 시간. (UNIX time)
  creationTime: number;
  // 해당 CSS 적용 여부.
  isApplied: boolean;
}

/**
 * AppStore 에서 관리하는 App Information 구조입니다.
 */
export interface AppInfo {
  type: Lowercase<AppType>;
  // -- 앱 이름.
  name: string;
  // -- 창 크기.
  width: number | undefined;
  height: number | undefined;
  // -- 외부 CSS 파일들. (Array<[파일명, 정보]>)
  // globalCSSs: Array<[string, CSSInfo]>;

  // 아직 사용 X.
  // author: string;
  // version: string;
  // id: string;
  // waplVersion: string;
  // creation: string;
  // lastSaved: string;
  // lockOrientation: boolean;
  // description: string;
  // startPage: string;
}

/**
 * App Type들의 이름 정보
 */
export const appTypeNames = ['UX', 'GX', 'BX', 'MX'] as const;

/**
 * App type 정보
 */
export type AppType = (typeof appTypeNames)[number];
