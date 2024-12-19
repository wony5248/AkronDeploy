import { createContext } from 'react';

/**
 * Editor Store 생성자 파라미터 Interface 입니다.
 */
export interface EditorStoreInitParams {}

/**
 * Editor Page 내에서 사용될 전역 Store Class 입니다.
 * Editor Page를 렌더하기 위해 사용되는 모든 기능을 전반적으로 관리합니다.
 */
class EditorStore {
  /**
   * 생성자
   */
  constructor(params: EditorStoreInitParams) {}
}

/**
 * Editor Store의 값을 component들에게 뿌려주는 context.
 */
export const EditorStoreContext = createContext<EditorStore>({} as EditorStore);

/**
 * Editor Store Context의 provider component.
 */
export const EditorStoreProvider = EditorStoreContext.Provider;

export default EditorStore;
