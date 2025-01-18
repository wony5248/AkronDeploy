import { DialogSize } from 'components/controls/dialog/DialogComponent';
import { createContext, useContext } from 'react';

/**
 * Dialog close props
 */
export interface ICloseProps {
  // autoClose 가 true인 경우(default:true) handler를 호출합니다.
  autoClose?: boolean;
  // onClose handler
  handler(): void;
}

/**
 * Dialog 하위에서 공유하는 데이터
 */
interface IDialogData {
  onClose: ICloseProps;
  size: DialogSize;
}

/**
 * 하위 children에게 데이터를 공유하기 위함.
 */
export const DialogContext = createContext<IDialogData>({} as IDialogData);

const useDialogContext = (): IDialogData => useContext(DialogContext);

export default useDialogContext;
