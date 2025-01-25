import ImageResourceComponent from 'components/common/ImageResourceComponent';
import {
  menuItem,
  menuItemImage,
  menuItemLabel,
  menuItemWrapper,
  menuNoImageItemLabel,
} from 'styles/ribbon-menu/menu-item/MenuItem';

/**
 * NormalMenuItem props
 */
interface IProps {
  id: string;
  label: string;
  image?: string;
  commandPropName: string;
  commandType: string;
  disabled: boolean;
  handleClose: () => void;

  // 확인을 클릭할 경우의 handler.
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
}

const NormalMenuItemComponent: React.FC<IProps> = (props: IProps) => {
  const { id, label, image, commandPropName, commandType, disabled, handleClose, onClick } = props;

  return (
    <div
      css={menuItem(disabled)}
      onClick={() => {
        onClick(commandPropName, commandType);
        handleClose();
      }}
      key={id}
    >
      <div css={menuItemWrapper}>
        {image && <ImageResourceComponent css={menuItemImage} id={image} w={'14px'} h={'14px'} />}
        <div css={image ? menuItemLabel : menuNoImageItemLabel}>{label}</div>
      </div>
    </div>
  );
};

export default NormalMenuItemComponent;
