import { Interpolation, Theme } from '@emotion/react';
import {
  textField,
  textFieldError,
  textFieldInput,
  textFieldUnitLeft,
  textFieldUnitRight,
} from 'styles/controls/TextField';

/**
 * TextFieldComponent props.
 */
interface IProps {
  css?: Interpolation<Theme>;
  value: string | undefined;
  inputType?: string;
  disabled?: boolean;
  placeholder?: string;
  showError?: boolean;
  errorText?: string;
  unit?: string;
  unitPlace?: string;
  icon?: JSX.Element;
  onChange: (value: string) => void;
  onKeyPress?: (key: string) => void;
  onBlur?: () => void;
  componentInsertToolpane?: boolean;
}

/**
 * 툴페인 등에서 공통적으로 사용할 text field 컨트롤입니다.
 */
const TextFieldComponent: React.FC<IProps> = ({
  css,
  componentInsertToolpane = false,
  value,
  inputType = 'text',
  disabled = false,
  placeholder = undefined,
  showError = false,
  errorText = '',
  unit = undefined,
  unitPlace = undefined,
  icon = undefined,
  onChange,
  onKeyPress,
  onBlur,
}: IProps) => {
  // 에러 텍스트가 정의되어 있으면 에러 텍스트 영역을 항상 렌더함.
  // (정상 모드 <-> 에러 모드를 오갈 때 컴포넌트가 위아래로 왔다갔다 하는 걸 막음)
  const showErrorArea = errorText.length > 0;

  return (
    <>
      <div css={[textField(disabled, showError, componentInsertToolpane), css]}>
        {icon}
        {unitPlace === 'left' && <span css={textFieldUnitLeft}>{unit}</span>}
        <input
          disabled={disabled}
          css={textFieldInput}
          value={value}
          type={inputType}
          onChange={event => {
            onChange(event.target.value);
          }}
          onKeyPress={event => {
            if (onKeyPress) {
              onKeyPress(event.key);
            }
          }}
          onBlur={onBlur}
          placeholder={placeholder}
        />
        {unitPlace === 'right' && <span css={textFieldUnitRight}>{unit}</span>}
      </div>
      {showErrorArea && <div css={textFieldError}>{showError ? errorText : ''}</div>}
    </>
  );
};

export default TextFieldComponent;
