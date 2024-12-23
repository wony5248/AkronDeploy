import { OperationMessage } from 'models/message/OperationMessage';

/**
 * Node 공통 Message Interface 입니다.
 * 각 모델이 직접 자신의 메세지를 만드는 방식으로 변경되었습니다.
 * documentId의 경우, 서버에서 HTTPRequest Header의 정보를 사용합니다.
 */
export interface IOperationMessage extends OperationMessage {
  [key: string]:
    | string
    | number
    | null
    | undefined
    | boolean
    | object
    | number[]
    | {
        topMargin?: string;
        topMarginType?: string;
        bottomMargin?: string;
        bottomMarginType?: string;
        leftMargin?: string;
        leftMarginType?: string;
        rightMargin?: string;
        rightMarginType?: string;
      };
}
