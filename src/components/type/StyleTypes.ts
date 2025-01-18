/**
 * Common Component 내에서 사용할 공통 Style Type을 정의합니다.
 */

/**
 * Common Control에 대한 style type 입니다.
 */
export type ControlStyle = 'line' | 'fill' | 'none';

/**
 * icon을 표시하기 위한 status type 입니다.
 * Component properties에 정의된 status
 */
export type ControlStatus = 'success' | 'warn' | 'error' | 'info';

/**
 * icon props
 * Common Control 내에서 사용하는 ImageResourceComponent의 key
 */
export interface IIconProps {
  leftIcon?: string;
  rightIcon?: string;
}

/**
 * Tooltip, Toggletip 등의 direction 타입
 */
export type DirectionType = 'top' | 'bottom' | 'left' | 'right';

/**
 * Bottom 영역에서 사용하는 Button group props
 */
export interface IBottomProps {
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonHandler?(e: React.MouseEvent): void;
  secondaryButtonHandler?(e: React.MouseEvent): void;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
}
