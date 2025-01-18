import DropdownMenuComponent from 'components/controls/dropdown/DropdownMenuComponent';
import DropdownToggleComponent from 'components/controls/dropdown/DropdownToggleComponent';
import { StandardSize } from 'components/type/SizeTypes';
import { ControlStyle, IIconProps } from 'components/type/StyleTypes';
import useDropdown from 'hooks/controls/useDropdown';
import { DropdownContext } from 'hooks/controls/useDropdownContext';
import { DropdownOption } from 'models/widget/WidgetPropTypes';
import { useEffect, useState } from 'react';
import { dropdown, title as dropdownTitle } from 'styles/controls/dropdown/Dropdown';

/**
 * Dropdown에 대한 size type 입니다.
 */
export type DropdownSize = StandardSize;

/**
 * Dropdown에 대한 style type 입니다.
 */
export type DropdownType = ControlStyle;

/**
 * icon props
 */
interface IDropdownIconProps extends IIconProps {
  menuItemLeftIcon?: string;
  menuItemRightIcon?: string;
}

/**
 * Dropdown Props
 */
interface IProps {
  // Dropdown을 구성하는 option array
  options: DropdownOption[];
  // Component properties에 정의된 style type
  type?: DropdownType;
  // Component properties에 정의된 size
  size?: DropdownSize;
  // 메뉴 아이템 최대 노출 개수 (초과 시 스크롤바 표시 / 설정하지 않을 경우 300px 높이 만큼 노출)
  visibleCount?: number;
  // 현재 선택된 값
  value?: any;
  // Dropdown 내부 placeholder로 표현될 default value
  placeholder?: any;
  // GUI Guide에 정의된 가변 width
  width?: string;
  // Dropdown 상위에 표현될 text
  title?: string;
  // Toggle 및 menuItem의 Text 좌/우 ImageResourceComponent의 key
  icon?: IDropdownIconProps;
  onChange: (value: any) => void;
}

/**
 * Akron Design System > Dropdown > Dropdown
 */
const DropdownComponent = ({
  options,
  type = 'line',
  size = 'small',
  visibleCount,
  value,
  placeholder,
  width,
  title,
  icon,
  onChange,
}: IProps): JSX.Element => {
  const titleLabel = title || ''; // useTextResource(title || '');
  const { isOpen, setIsOpen, ref } = useDropdown(false);

  const [selectedOption, setSelectedOption] = useState<DropdownOption>({
    label: placeholder || '',
    value,
  });

  // value와 label이 일치하지 않는 경우, value에 맞는 label을 dropdown에 렌더하기 위함
  useEffect(() => {
    const foundOption = options.find(option => option.value === value);
    if (!foundOption) {
      return;
    }
    setSelectedOption({
      label: foundOption.label,
      value: foundOption.value,
    });
  }, [options, value]);

  return (
    <DropdownContext.Provider
      value={{
        value: selectedOption.value,
        label: selectedOption.label,
        type,
        size,
        placeholder,
      }}
    >
      <div
        css={dropdown}
        style={{ width: `${width}px` }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
      >
        {titleLabel && <span css={dropdownTitle}>{titleLabel}</span>}
        <DropdownToggleComponent isOpen={isOpen} icon={{ leftIcon: icon?.leftIcon, rightIcon: icon?.rightIcon }} />
        {isOpen && (
          <DropdownMenuComponent
            options={options}
            visibleCount={visibleCount}
            icon={{ leftIcon: icon?.menuItemLeftIcon, rightIcon: icon?.menuItemRightIcon }}
            onClick={(option: DropdownOption) => {
              onChange(option.value);
              setIsOpen(false);
            }}
          />
        )}
      </div>
    </DropdownContext.Provider>
  );
};

export default DropdownComponent;
