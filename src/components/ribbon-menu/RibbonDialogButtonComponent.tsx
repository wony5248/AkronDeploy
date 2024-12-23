// import styles from 'common/style/ribbon-menu/RibbonMenu.scss';
import * as React from 'react';
import { ribbonDialogContentMap } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import { ribbonButtonLabel, ribbonDropdownButton, ribbonDropdownButtonIcon } from 'styles/ribbon-menu/RibbonMenu';

/**
 * Dialog Button을 나타내는 component props.
 */
interface IProps {
  label: string;
  image: string;
  commandPropName: string;
  commandType: string;
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
}

/**
 * 변수 Data Button을 나타내는 component.
 */
const RibbonDialogButtonComponent: React.FC<IProps> = (props: IProps) => {
  const { label, image, commandType, commandPropName, onClick } = props;

  const [open, setOpen] = React.useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const DialogContent = ribbonDialogContentMap[commandPropName];

  return (
    <div>
      <div css={ribbonDropdownButton}>
        <div css={ribbonDropdownButtonIcon} onClick={handleDialogOpen}>
          {/* <ImageResourceComponent id={image} w={'18px'} h={'18px'} /> */}
          <button style={{ width: '18px', height: '18px' }} />
        </div>
        <div css={ribbonButtonLabel} onClick={handleDialogOpen}>
          {/* {useTextResource(label)} */}
          {label}
        </div>
      </div>
      {open && DialogContent && (
        <DialogContent
        // open={open}
        // handleClose={() => {
        //     handleDialogClose();
        // }}
        // commandPropName={commandPropName}
        // commandType={commandType}
        // onClick={onClick}
        />
      )}
    </div>
  );
};

export default RibbonDialogButtonComponent;
