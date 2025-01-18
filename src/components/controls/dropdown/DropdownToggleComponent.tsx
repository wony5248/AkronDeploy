import { IIconProps } from 'components/type/StyleTypes';
import useDropdownContext from 'hooks/controls/useDropdownContext';
import { dropdownToggle, placeholder as dropdonwPlaceholder } from 'styles/controls/dropdown/Dropdown';

/**
 * Dropdown Toggle Props
 */
interface IProps {
  // Dropdown Menu의 열림/닫힘 상태
  isOpen: boolean;
  // Toggle의 Text 좌/우 ImageResourceComponent의 key
  icon: IIconProps;
}

const DropdownToggleComponent = ({ isOpen, icon }: IProps): JSX.Element => {
  const { value, label, type, size, placeholder } = useDropdownContext();
  const { leftIcon, rightIcon } = icon;

  return (
    <div
      css={[dropdownToggle(type), dropdownToggle(size), value === undefined && placeholder ? dropdonwPlaceholder : '']}
      role="button"
      aria-expanded={isOpen}
    >
      {
        leftIcon && (
          <button style={{ width: '16px', height: '16px' }} />
        ) /*<ImageResourceComponent id={leftIcon} w="16px" h="16px" />*/
      }
      <span>{label}</span>
      {
        rightIcon && (
          <button style={{ width: '16px', height: '16px' }} />
        ) /*<ImageResourceComponent id={rightIcon} w="16px" h="16px" />*/
      }
      {/* <ImageResourceComponent
                 className={styles.toggleIcon}
                 id={size === 'large' ? 'IC_CHEVRON_THIN_LARGE_DOWN' : 'IC_CHEVRON_THIN_SMALL_DOWN'}
                 w="24px"
                 h="24px"
             /> */}
      <button style={{ width: '24px', height: '24px' }} />
    </div>
  );
};

export default DropdownToggleComponent;
