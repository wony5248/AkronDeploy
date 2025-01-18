import { IIconProps } from 'components/type/StyleTypes';
import useDropdownContext from 'hooks/controls/useDropdownContext';
import { DropdownOption } from 'models/widget/WidgetPropTypes';
import { useId } from 'react';
import { menu, menuItem } from 'styles/controls/dropdown/Dropdown';

const heightSizes = {
  xsmall: 28,
  small: 32,
  medium: 40,
  large: 48,
};

const MENU_ITEM_SPACING = 12;

/**
 * Dropdown Menu Base Props
 */
interface DropdownMenuBaseProps {
  // Dropdown을 구성하는 option array
  options: DropdownOption[];
  // menuItem Text의 좌/우 ImageResourceComponent의 key
  icon?: IIconProps;
}

/**
 * DropdownMenuComponent를 독립적으로 사용하는 경우에 대한 Props
 */
export interface IDropdownMenuOnlyProps extends DropdownMenuBaseProps {
  // 현재 선택된 값
  propValue: any;
  onChange: (value: any) => void;
}

/**
 * Dropdown Menu Props
 */
interface IDropdownMenuProps extends DropdownMenuBaseProps {
  // 현재 선택된 값
  propValue?: any;
  visibleCount?: number;
  onClick: (option: DropdownOption) => void;
}

/**
 * Akron Design System > Dropdown > Dropdown_item
 */
const DropdownMenuComponent = ({
  propValue,
  visibleCount,
  options,
  icon,
  onClick,
}: IDropdownMenuProps): JSX.Element => {
  const { value, type = 'line', size = 'small', placeholder } = useDropdownContext();
  const { leftIcon, rightIcon } = icon || {};
  const id = useId();
  const currentValue = propValue || value;

  const isSelectedMenu = (optionValue: any) => {
    if (currentValue !== undefined) {
      return String(currentValue) === String(optionValue);
    }
    return String(placeholder) === String(optionValue);
  };

  const style = visibleCount ? { maxHeight: `${heightSizes[size] * visibleCount + MENU_ITEM_SPACING}px` } : undefined;

  return (
    <ul css={[menu(type), menu(size)]} style={style} role="listbox">
      {options.map(option => {
        const { value: optionValue, label } = option;
        const selectedMenu = isSelectedMenu(optionValue);
        return (
          <li
            css={[menuItem(type), menuItem(size)]}
            key={`dropdown-${optionValue}-${id}`}
            id={`${optionValue}-${id}`}
            role="option"
            aria-selected={selectedMenu}
            onClick={() => onClick(option)}
          >
            {
              leftIcon && (
                <button style={{ width: '16px', height: '16px' }} />
              ) /*<ImageResourceComponent id={leftIcon} w="16px" h="16px" />*/
            }
            <span>{label}</span>
            {
              selectedMenu && (
                <button style={{ width: '20px', height: '20px' }} />
              ) /*<ImageResourceComponent id={'IC_CHECK'} w="20px" h="20px" />*/
            }
            {
              rightIcon && (
                <button style={{ width: '16px', height: '16px' }} />
              ) /*<ImageResourceComponent id={rightIcon} w="16px" h="16px" />*/
            }
          </li>
        );
      })}
    </ul>
  );
};

export default DropdownMenuComponent;
