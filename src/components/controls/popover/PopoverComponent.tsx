import { Interpolation, Theme } from '@emotion/react';
import PortalComponent from 'components/common/PortalComponent';
import DialogBottomComponent from 'components/controls/dialog/DialogBottomComponent';
import DialogContentComponent from 'components/controls/dialog/DialogContentComponent';
import DialogHeaderComponent, { IHeaderProps } from 'components/controls/dialog/DialogHeaderComponent';
import { StandardSize } from 'components/type/SizeTypes';
import { DirectionType, IBottomProps } from 'components/type/StyleTypes';
import { DialogContext, ICloseProps } from 'hooks/controls/useDialogContext';
import useOutsideClick from 'hooks/controls/useOutsideClick';
import usePopoverPosition from 'hooks/controls/usePopoverPosition';
import { ReactNode } from 'react';
import { popover } from 'styles/controls/popover/Popover';

/**
 * Popover에 대한 size type 입니다.
 */
export type PopoverSize = StandardSize;

/**
 * Popover Props
 */
interface IProps {
  css?: Interpolation<Theme>;
  anchorEl: HTMLElement | null;
  // Component properties에 정의된 size
  size?: PopoverSize;
  // Popover가 target으로 부터 생성되는 방향
  direction?: DirectionType;
  // Popover 상위에 표현될 text
  title: string;
  // PopoverHeader의 구성 요소
  headerProps?: IHeaderProps;
  // PopoverContent Content를 구성하는 요소
  children: ReactNode;
  // PopoverBottom의 구성 요소
  bottomProps?: IBottomProps;
  onClose: ICloseProps;
}

/**
 * Akron Design System > Popover
 */
const PopoverComponent = ({
  css,
  anchorEl,
  size = 'small',
  direction = 'right',
  title,
  headerProps,
  children,
  bottomProps,
  onClose,
}: IProps): JSX.Element => {
  const { handler: handleClose } = onClose;
  const { ref } = useOutsideClick(handleClose);
  const { left, top } = usePopoverPosition({ anchorEl, ref, direction });

  return (
    <PortalComponent>
      <DialogContext.Provider value={{ onClose, size }}>
        <div
          ref={ref}
          css={[popover(size), css]}
          style={{
            left: `${left}px`,
            top: `${top}px`,
          }}
        >
          <DialogHeaderComponent title={title} headerProps={headerProps} />
          <DialogContentComponent>{children}</DialogContentComponent>
          <DialogBottomComponent bottomProps={bottomProps} />
        </div>
      </DialogContext.Provider>
    </PortalComponent>
  );
};

export default PopoverComponent;
