import ImageResourceButtonComponent from 'components/common/ImageResourceButtonComponent';
import DialogHeaderDropdownComponent from 'components/controls/dialog/DialogHeaderDropdownComponent';
import DialogHeaderLabelsComponent from 'components/controls/dialog/DialogHeaderLabelsComponent';
import { IDropdownMenuOnlyProps } from 'components/controls/dropdown/DropdownMenuComponent';
import { ControlStatus } from 'components/type/StyleTypes';
import useDialogContext from 'hooks/controls/useDialogContext';
import { closeButton, header, headerContent, headerDetail } from 'styles/controls/dialog/Dialog';

/**
 * Dialog에 대한 type 입니다.
 */
export type DialogType = 'add' | 'delete' | 'edit' | 'save' | 'settings';

/**
 * DialogType에 따른 Title Image Map
 */
const dialogImgIdMap: Record<DialogType, string> = {
  add: 'IMG_DIALOG',
  delete: 'IMG_DIALOG-1',
  edit: 'IMG_DIALOG-2',
  save: 'IMG_DIALOG-3',
  settings: 'IMG_DIALOG-4',
};

/**
 * Dialog Header Content props
 */
export interface IHeaderProps {
  // title 하위에 표현될 text
  subText?: string;
  // 해당 상태에 따라 이미지를 render 합니다.
  status?: ControlStatus;
  // 해당 type에 따라 Dialog 상단 이미지를 render 합니다.
  // Component properties에 정의된 type
  type?: DialogType;
  // Dialog 내 Dropdown 구성 요소
  dropdownProps?: IDropdownMenuOnlyProps;
}

/**
 * Dialog Header Props
 */
interface IProps {
  // Dialog 상위에 표현될 text
  title: string;
  headerProps?: IHeaderProps;
}

/**
 * Akron Design System > Dialog > Dialog_header
 */
const DialogHeaderComponent = ({ title, headerProps }: IProps): JSX.Element => {
  const { onClose, size } = useDialogContext();
  const { subText, status, type, dropdownProps } = headerProps || {};
  const { handler } = onClose;

  return (
    <div css={header(size)}>
      <div css={headerContent(size)}>
        {
          type && size !== 'xsmall' && <button style={{ width: '28px', height: '28px' }} />
          /*                <ImageResourceComponent id={dialogImgIdMap[type]} w="40px" h="40px" />*/
        }
        <div css={headerDetail}>
          {status && (
            // <ImageResourceComponent
            //     className={styles.statusIcon}
            //     aria-label={`${status}_image`}
            //     id={`IC_ALERT_${status.toUpperCase()}`}
            //     w="28px"
            //     h="28px"
            // />
            <button style={{ width: '28px', height: '28px' }} />
          )}
          <DialogHeaderLabelsComponent title={title} subText={subText} size={size} />
          {dropdownProps && <DialogHeaderDropdownComponent dropdownProps={dropdownProps} size={size} />}
        </div>
      </div>
      {/* <ImageResourceButtonComponent
        buttonClassName={styles.closeButton}
        aria-label={'close button'}
        onClick={handler}
        id={'IC_CLOSE'}
        w="28px"
        h="28px"
      /> */}
      <button
        aria-label={'close button'}
        onClick={handler}
        css={closeButton}
        style={{ width: '28px', height: '28px' }}
      />
    </div>
  );
};

export default DialogHeaderComponent;
