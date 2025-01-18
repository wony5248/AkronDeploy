import { DialogSize } from 'components/controls/dialog/DialogComponent';
import DropdownMenuComponent, { IDropdownMenuOnlyProps } from 'components/controls/dropdown/DropdownMenuComponent';
import useDropdown from 'hooks/controls/useDropdown';
import { DropdownOption } from 'models/widget/WidgetPropTypes';
import { dropdown } from 'styles/controls/dialog/Dialog';

/**
 * Dialog Header Dropdown Props
 */
interface IProps {
  // Dialog 내 Dropdown 구성 요소
  dropdownProps: IDropdownMenuOnlyProps;
  // Component properties에 정의된 size
  size: DialogSize;
}

// DialogHeader > Dropdown
const DialogHeaderDropdownComponent = ({ dropdownProps, size }: IProps): JSX.Element => {
  const { isOpen, setIsOpen, ref } = useDropdown(false);
  const { options, propValue, icon, onChange } = dropdownProps;

  return (
    <div ref={ref} css={dropdown} aria-expanded={isOpen}>
      {/* <ImageResourceButtonComponent
                buttonClassName={classNames(styles.dropdownIcon, {
                    [styles.dropdownLargeIcon]: size === 'large',
                })}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={'toggle button'}
                id={'IC_CHEVRON_REGULAR_SMALL_DOWN'}
                w="28px"
                h="28px"
            /> */}
      <button style={{ width: '28px', height: '28px' }} />

      {isOpen && (
        <DropdownMenuComponent
          options={options}
          propValue={propValue}
          icon={{ leftIcon: icon?.leftIcon, rightIcon: icon?.rightIcon }}
          onClick={(option: DropdownOption) => {
            onChange(option.value);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DialogHeaderDropdownComponent;
