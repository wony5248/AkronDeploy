import ImageResourceComponent from 'components/common/ImageResourceComponent';
import { useState } from 'react';
import {
  defaultValue,
  dropdown,
  dropdownButton,
  dropdownButtonGroup,
  dropdownContent,
  dropdownOption,
  dropdownOptionGroup,
  dropdownValue,
} from 'styles/controls/DropDown';

/**
 * 선택 가능한 각 값의 정보입니다.
 */
export interface DropdownOption {
  label: string;
  value: any;
}

/**
 * DropdownComponent props.
 */
interface IProps {
  className?: string;
  value: any; // string
  options: Array<DropdownOption>;
  onChange: (value: any) => void;
  disabled?: boolean;
  // 기본 동작은 false 시 option만 닫히고, true 시 닫힐 때 onChange가 같이 불립니다.
  changeBlur?: boolean;
  placeholder?: string;
  dropdownOptionClassName?: string;
  valueUndefined?: boolean;
}

/**
 * legacy dropdown. 디자인이 해당 컴포넌트가 더 알맞는 것 같아 복구
 * 툴페인 등에서 공통적으로 사용할 text spinner 컨트롤입니다.
 */
const DropdownComponent: React.FC<IProps> = ({
  className,
  value,
  options,
  onChange,
  disabled = false,
  changeBlur = false,
  placeholder = undefined,
  dropdownOptionClassName,
  valueUndefined = false,
}: IProps) => {
  const [isOpen, setOpen] = useState(false);

  const onButtonClick = () => {
    setOpen(!isOpen);
  };

  const onOptionClick = (option: DropdownOption) => {
    onChange(option.value);
    setOpen(false);
  };

  // value와 일치하는 option이 있으면 해당하는 label을 표시.
  // 없으면 그냥 value를 표시.
  let label = value;

  for (let i = 0; i < options.length; i += 1) {
    if (options[i].value === value) {
      label = options[i].label;
      break;
    }
  }

  return (
    <div
      className={className}
      css={dropdown(disabled)}
      onBlur={() => {
        setOpen(false);
      }}
    >
      <div css={dropdownContent(disabled)}>
        <button
          disabled={disabled}
          css={[dropdownValue, valueUndefined === true ? defaultValue : undefined]}
          type={'button'}
          onClick={onButtonClick}
        >
          {valueUndefined ? placeholder : label}
        </button>
        <div css={dropdownButtonGroup}>
          <button disabled={disabled} css={dropdownButton(disabled)} type={'button'} onClick={onButtonClick}>
            <ImageResourceComponent id={'IC_TOOLPANE_ARROW_DOWN_NORMAL'} w={'16px'} h={'16px'} />
            {/* <div style={{ width: '16px', height: '16px' }} /> */}
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className={dropdownOptionClassName}
          css={dropdownOptionGroup}
          // onBlur()가 onClick()보다 먼저 불리기 때문에 onClick()이 불리기 전에 dropdown을 닫아버리는 문제가 있음.
          // Option 클릭 시 onBlur()가 불리지 않도록 함.
          // https://coffeeandcakeandnewjeong.tistory.com/70
          onMouseDown={event => {
            event.preventDefault();
          }}
          style={dropdownOptionClassName === 'booleanDropdown' ? { marginLeft: '-8px' } : {}}
        >
          {options.map(option => (
            <button
              key={option.label}
              css={dropdownOption}
              type={'button'}
              onClick={() => {
                onOptionClick(option);
              }}
              onBlur={() => {
                if (changeBlur) {
                  onOptionClick(option);
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownComponent;
