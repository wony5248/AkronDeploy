/**
 * @interface OperationMessage - operation message를 담고 있는 인터페이스
 * @역할1 다른 유저에게 변경사항을 알리기 위해 사용
 * @역할2 update를 위한 dirty 수집의 단위
 */
export interface OperationMessage {
  elementId: number;
  parentId?: number | null;
  prevId?: number | null;
  nextId?: number | null;
  childId?: number | null;
  elementType: number;
  objectType: number;
  behavior?: string;
  contentData?: string;
  oldPrevId?: number;
  oldParentId?: number;
}
