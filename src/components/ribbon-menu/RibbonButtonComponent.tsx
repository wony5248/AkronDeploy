// import styles from 'common/style/ribbon-menu/RibbonMenu.scss';

import ImageResourceComponent from 'components/common/ImageResourceComponent';
import { ribbonButtonLabel, ribbonDropdownButton, ribbonDropdownButtonIcon } from 'styles/ribbon-menu/RibbonMenu';

/**
 * 변수 Data Button을 나타내는 component props.
 */
interface IProps {
  label: string;
  image: string;
  commandType?: string;
  commandPropName?: string;
  onClick: (commandPropName: string, commandType: string, ...args: unknown[]) => void;
}

/**
 * 변수 Data Button을 나타내는 component.
 */
const RibbonButtonComponent: React.FC<IProps> = (props: IProps) => {
  const { label, image, commandType, commandPropName, onClick } = props;

  return (
    <div>
      <div css={ribbonDropdownButton}>
        <div
          css={ribbonDropdownButtonIcon}
          onClick={() => {
            onClick(commandPropName || 'None', commandType || 'None');
          }}
        >
          <ImageResourceComponent id={image} w={'18px'} h={'18px'} />
        </div>
        <div
          css={ribbonButtonLabel}
          onClick={() => {
            onClick(commandPropName || 'None', commandType || 'None');
          }}
        >
          {/* {useTextResource(label)} */ label}
        </div>
      </div>
    </div>
  );
};

export default RibbonButtonComponent;
