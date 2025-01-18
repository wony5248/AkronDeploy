import useDialogContext from 'hooks/controls/useDialogContext';
import { ReactNode } from 'react';
import { contentWrapper } from 'styles/controls/dialog/Dialog';

/**
 * Dialog Content Props
 */
interface IProps {
  children: ReactNode;
}

/**
 * Design System > Dialog > Dialog_contents
 */
const DialogContentComponent = ({ children }: IProps): JSX.Element => {
  const { size } = useDialogContext();

  return <div css={contentWrapper(size)}>{children}</div>;
};

export default DialogContentComponent;
