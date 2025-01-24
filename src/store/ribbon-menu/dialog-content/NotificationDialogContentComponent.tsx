import { isDefined } from '@akron/runner';
import DialogComponent from 'components/controls/dialog/DialogComponent';
import { ReactNode } from 'react';
import { IDialogContentProps } from 'store/ribbon-menu/RibbonCommonTypes';
import { message, warningDeleteConfirm } from 'styles/ribbon-menu/DeleteComponentConfirmDialog';

/**
 * Business Logic Delete Dialog content props
 */
interface IProps extends IDialogContentProps {
  propsTitleID?: string;
  propsPlainContent: ReactNode;
  propsWarnContent?: ReactNode;
}

/**
 * common 한 confirm dialog
 *
 * plainContent 이 첫줄의 검정글씨
 * warnContent 이 두번째 줄의 빨간색 글씨
 */
const NotificationDialogContentComponent: React.FC<IProps> = (props: IProps) => {
  const { open, handleClose, propsTitleID, propsPlainContent, propsWarnContent } = props;
  return (
    <DialogComponent open={open} onClose={{ handler: handleClose }} title={propsTitleID ?? ''}>
      <div css={message}>{propsPlainContent}</div>
      {isDefined(propsWarnContent) && <div css={warningDeleteConfirm}>{propsWarnContent}</div>}
    </DialogComponent>
  );
};

export default NotificationDialogContentComponent;
