import ButtonComponent from 'components/controls/ButtonComponent';
import { StandardSize } from 'components/type/SizeTypes';
import { IBottomProps } from 'components/type/StyleTypes';
import useDialogContext from 'hooks/controls/useDialogContext';
import { bottom } from 'styles/controls/dialog/Dialog';

/**
 * Dialog Bottom Props
 */
interface IProps {
  bottomProps?: IBottomProps;
}

/**
 * Dialog button size map
 */
const buttonSizeMap: Record<StandardSize, StandardSize> = {
  xsmall: 'small',
  small: 'medium',
  medium: 'medium',
  large: 'large',
};

/**
 * Akron Design System > Dialog > Dialog_bottom
 */
const DialogBottomComponent = ({ bottomProps }: IProps): JSX.Element => {
  const { onClose, size } = useDialogContext();
  const {
    primaryButtonText,
    secondaryButtonText,
    primaryButtonHandler,
    secondaryButtonHandler,
    primaryButtonDisabled,
    secondaryButtonDisabled,
  } = bottomProps || {};

  const { autoClose = true, handler: handleClose } = onClose;

  const handleClick = (handler?: (e: React.MouseEvent) => void) => {
    return (e: React.MouseEvent) => {
      if (handler) {
        handler(e);
      }
      if (!autoClose) {
        return;
      }
      handleClose();
    };
  };

  return (
    <div css={bottom(size)}>
      {secondaryButtonText && (
        <ButtonComponent
          type={'secondary'}
          common
          text={secondaryButtonText}
          size={buttonSizeMap[size]}
          disabled={secondaryButtonDisabled}
          onClick={handleClick(secondaryButtonHandler)}
        />
      )}
      <ButtonComponent
        common
        text={primaryButtonText || '확인'}
        size={buttonSizeMap[size]}
        disabled={primaryButtonDisabled}
        onClick={handleClick(primaryButtonHandler)}
      />
    </div>
  );
};

export default DialogBottomComponent;
