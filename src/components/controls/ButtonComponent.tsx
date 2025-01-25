import ImageResourceComponent from 'components/common/ImageResourceComponent';
import { StandardSize } from 'components/type/SizeTypes';
import { IIconProps } from 'components/type/StyleTypes';
import { button, buttonVariants } from 'styles/controls/Button';

/**
 * Button의 style type 입니다.
 */
type ButtonType = 'primary' | 'secondary' | 'assistive';

/**
 * Button에 대한 size type 입니다.
 */
type ButtonSize = StandardSize;

/**
 * Button Props
 */
interface IProps {
  // Component properties에 정의된 style
  type?: ButtonType;
  // Component properties에 정의된 product가 cm인 경우
  common?: boolean;
  // Component properties에 정의된 size
  size?: ButtonSize;
  // Button 내부에 표현될 text
  text: string;
  // Text 좌/우 ImageResourceComponent의 key
  icon?: IIconProps;
  // Button의 비활성화 여부
  disabled?: boolean;
  onClick?(e: React.MouseEvent): void;
}

/**
 * Akron Design System > Button > Button
 */
const ButtonComponent = ({
  type = 'primary',
  common,
  size = 'xsmall',
  text,
  icon,
  disabled,
  onClick,
}: IProps): JSX.Element => {
  const label = text; // useTextResource(text);
  const { leftIcon, rightIcon } = icon || {};

  return (
    <button
      type={'button'}
      css={[button(size), buttonVariants(type), common ? buttonVariants(`${type}Common`) : '']}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      onClick={onClick}
    >
      {leftIcon && <ImageResourceComponent id={leftIcon} />}
      {label}
      {rightIcon && <ImageResourceComponent id={rightIcon} />}
    </button>
  );
};

export default ButtonComponent;
