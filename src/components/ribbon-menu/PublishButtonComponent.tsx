import * as React from 'react';
import { ribbonDialogContentMap } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import { publishButton } from 'styles/ribbon-menu/RibbonMenu';

/**
 * DialogMenuItem props
 */
interface IProps {
  id: string;
  commandPropName: string;
  commandType: string;

  // 확인을 클릭할 경우의 handler.
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
}

const PublishButtonComponent: React.FC<IProps> = (props: IProps) => {
  const [open, setOpen] = React.useState(false);

  const { id, commandPropName, commandType, onClick } = props;

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const DialogContent = ribbonDialogContentMap[commandPropName];

  return (
    <div>
      <button
        css={publishButton}
        type={'button'}
        onClick={() => {
          handleDialogOpen();
        }}
        key={id}
      >
        배포하기
      </button>
      {open && (
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

export default PublishButtonComponent;
