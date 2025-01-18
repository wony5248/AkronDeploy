import PortalComponent from 'components/common/PortalComponent';
import DialogBottomComponent from 'components/controls/dialog/DialogBottomComponent';
import DialogContentComponent from 'components/controls/dialog/DialogContentComponent';
import DialogHeaderComponent, { IHeaderProps } from 'components/controls/dialog/DialogHeaderComponent';
import { StandardSize } from 'components/type/SizeTypes';
import { IBottomProps } from 'components/type/StyleTypes';
import { DialogContext, ICloseProps } from 'hooks/controls/useDialogContext';
import { ReactNode, useEffect, useRef } from 'react';
import { backdrop, dialog } from 'styles/controls/dialog/Dialog';

/**
 * Dialog에 대한 size type 입니다.
 */
export type DialogSize = StandardSize;

/**
 * Dialog Props
 */
interface IProps {
  // Dialog의 render 여부
  open: boolean;
  // Component properties에 정의된 size
  size?: DialogSize;
  // Dialog 상위에 표현될 text
  title: string;
  // DialogHeader의 구성 요소
  headerProps?: IHeaderProps;
  // DialogContent Content를 구성하는 요소
  children: ReactNode;
  // DialogBottom의 구성 요소
  bottomProps?: IBottomProps;
  onClose: ICloseProps;
}

/**
 * Akron Design System > Dialog
 */
const DialogComponent = ({
  open,
  size = 'small',
  title,
  headerProps,
  children,
  bottomProps,
  onClose,
}: IProps): JSX.Element => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open && ref.current) {
      // <dialog>로 focus set
      ref.current.show();
    }
    if (!open && ref.current) {
      ref.current.close();
    }
  }, [open]);

  return (
    <PortalComponent>
      <DialogContext.Provider value={{ onClose, size }}>
        <dialog ref={ref} css={dialog(size)}>
          <DialogHeaderComponent title={title} headerProps={headerProps} />
          <DialogContentComponent>{children}</DialogContentComponent>
          <DialogBottomComponent bottomProps={bottomProps} />
        </dialog>
      </DialogContext.Provider>
      <div css={backdrop} aria-hidden />
    </PortalComponent>
  );
};

export default DialogComponent;
