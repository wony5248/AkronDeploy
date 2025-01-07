/**
 * Node 공통 Message Interface 입니다.
 * 각 모델이 직접 자신의 메세지를 만드는 방식으로 변경되었습니다.
 * documentId의 경우, 서버에서 HTTPRequest Header의 정보를 사용합니다.
 */
export interface IContentMessage {
  elementId: number;
  elementType: string;
  objectType?: string | null;
  contentData?: string;
  behavior?: string; // SimpleCommand 단에서 Set 합니다.
}

/**
 * Node document의 공통으로 사용되는 관계 Message Interface 입니다.
 */
export interface IDocumentRelationMessage {
  elementId: number;
  parentId?: number | null;
  childId?: number | null;
  nextId?: number | null;
  elementType: string;
  behavior?: string;
}

// /**
//  * @interface UpdateMessage - operation message를 담고 있는 인터페이스
//  * @역할1 다른 유저에게 변경사항을 알리기 위해 사용
//  * @역할2 update를 위한 dirty 수집의 단위
//  */
// export interface UpdateMessage {
//   elementId: number;
//   parentId?: number | null;
//   prevId?: number | null;
//   nextId?: number | null;
//   childId?: number | null;
//   elementType: string;
//   objectType?: string | null;
//   behavior?: string;
//   contentData?: string;
//   oldPrevId?: number;
//   oldParentId?: number;
// }
