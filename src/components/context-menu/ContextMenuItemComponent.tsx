// import styles from 'common/style/context-menu/ContextMenuComponent.scss';
import * as React from 'react';
import { ContextMenuItemVariantType, ContextMenuProp } from 'store/context-menu/ContextMenuTypes';
import { DialogContentType, ribbonDialogContentMap } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import {
  contextMenuDivider,
  contextMenuDividerLine,
  contextMenuItemLarge,
  contextMenuItemMainText,
  contextMenuItemSmall,
  contextMenuItemSubText,
} from 'styles/context-menu/ContextMenuComponent';

/**
 * ContextMenuItem props
 */
interface ContextMenuItemProps {
  contextMenuData: ContextMenuProp;
  variant: ContextMenuItemVariantType;
  handleClose(): void;
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
  disabled: boolean;
}

/**
 * ContextMenuSmallItem props
 */
interface ContextMenuSmallItemProps {
  mainText?: string;
  contextMenuData: ContextMenuProp;
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
  handleClose: () => void;
  disabled?: boolean;
}

/**
 * ContextMenuLargeItem props
 */
interface ContextMenuLargeItemProps extends ContextMenuSmallItemProps {
  subText?: string;
}

/**
 * Context menu 내 구분선 컴포넌트입니다.
 */
const ContextMenuDividerComponent = () => {
  return (
    <div css={contextMenuDivider}>
      <div css={contextMenuDividerLine} />
    </div>
  );
};

/**
 * Context menu 내 subText(단축키)노출이 없는 아이템입니다.
 * 이후 Context menu 내에서 사용될 아이템은 SmallItem과 LargeItem을 기반으로 작성합니다.
 */
const ContextMenuSmallItemComponent = ({
  mainText,
  contextMenuData,
  onClick,
  handleClose,
  disabled,
}: ContextMenuSmallItemProps) => {
  const { commandPropName, commandType } = contextMenuData;

  if (!commandPropName || !commandType) {
    return <></>;
  }

  return (
    <button
      type={'button'}
      css={contextMenuItemSmall}
      onClick={() => {
        onClick(commandPropName, commandType);
        handleClose();
      }}
      disabled={disabled}
    >
      <div css={contextMenuItemMainText}>{mainText}</div>
    </button>
  );
};

/**
 * SmallMenuItem을 기반으로 작성된 SmallDialogMenuItem 입니다.
 * 아이템 클릭시 commandPropName을 통해 dialogContentMap에 매핑된 다이얼로그를 오픈합니다.
 */
const ContextMenuSmallDialogItemComponent = ({
  mainText,
  contextMenuData,
  onClick,
  handleClose,
  disabled,
}: ContextMenuSmallItemProps) => {
  const [open, setOpen] = React.useState(false);
  const { commandPropName, commandType } = contextMenuData;

  if (!commandPropName || !commandType) {
    return <></>;
  }

  const DialogComponent: DialogContentType = ribbonDialogContentMap[commandPropName];

  return (
    <>
      <button
        type={'button'}
        css={contextMenuItemSmall}
        onClick={() => {
          setOpen(true);
        }}
        disabled={disabled}
      >
        <div css={contextMenuItemMainText}>{mainText}</div>
      </button>
      {open && (
        <DialogComponent
          open={open}
          handleClose={() => {
            setOpen(false);
            handleClose();
          }}
          commandPropName={commandPropName}
          commandType={commandType}
          onClick={onClick}
        />
      )}
    </>
  );
};

/**
 * Context menu 내 subText(단축키)노출이 존재하는 아이템입니다.
 * 이후 Context menu 내에서 사용될 아이템은 SmallItem과 LargeItem을 기반으로 작성합니다.
 */
const ContextMenuLargeItemComponent = ({
  mainText,
  subText,
  contextMenuData,
  onClick,
  handleClose,
  disabled,
}: ContextMenuLargeItemProps) => {
  const { commandPropName, commandType } = contextMenuData;
  return (
    <button
      type={'button'}
      css={contextMenuItemLarge}
      onClick={() => {
        if (commandPropName && commandType) {
          onClick(commandPropName, commandType);
        }
        handleClose();
      }}
      disabled={disabled}
    >
      <div css={contextMenuItemMainText}>{mainText}</div>
      <div css={contextMenuItemSubText}>{subText}</div>
    </button>
  );
};

/**
 * LargeMenuItem을 기반으로 작성된 LargeDialogMenuItem 입니다.
 * 아이템 클릭시 commandPropName을 통해 dialogContentMap에 매핑된 다이얼로그를 오픈합니다.
 */
const ContextMenuLargeDialogItemComponent = ({
  mainText,
  subText,
  contextMenuData,
  onClick,
  handleClose,
  disabled,
}: ContextMenuLargeItemProps) => {
  const [open, setOpen] = React.useState(false);
  const { commandPropName, commandType } = contextMenuData;

  if (!commandPropName || !commandType) {
    return <></>;
  }

  const DialogComponent: DialogContentType = ribbonDialogContentMap[commandPropName];
  return (
    <>
      <button
        type={'button'}
        css={contextMenuItemLarge}
        onClick={() => {
          setOpen(true);
        }}
        disabled={disabled}
      >
        <div css={contextMenuItemMainText}>{mainText}</div>
        <div css={contextMenuItemSubText}>{subText}</div>
      </button>
      {open && (
        <DialogComponent
          open={open}
          handleClose={() => {
            setOpen(false);
            handleClose();
          }}
          commandPropName={commandPropName}
          commandType={commandType}
          onClick={onClick}
        />
      )}
    </>
  );
};

/**
 * Context menu 내 노출될 아이템입니다.
 * variant에 따라서 구분선, SmallItem, SmallDialogMenuItem, LargeItem을 반환합니다.
 *
 * @param contextMenuData Context menu 아이템 데이터
 * @param variant SeparatorItem | SmallMenuItem | SmallDialogMenuItem | LargeMenuItem 로 구분되며, 해당 값에 따라 아이템을 반환합니다.
 * @param handleClose Context menu 닫힘 함수
 * @param onClick Context menu 아이템 클릭시 동작할 함수
 * @param disabled Context menu 아이템이 disable 처리될 것인지 판단할 boolean 값
 */
const ContextMenuItemComponent = ({
  contextMenuData,
  variant,
  handleClose,
  onClick,
  disabled,
}: ContextMenuItemProps) => {
  switch (variant) {
    case 'SeparatorItem':
      return <ContextMenuDividerComponent />;
    case 'SmallMenuItem':
      return (
        <ContextMenuSmallItemComponent
          onClick={onClick}
          handleClose={handleClose}
          mainText={contextMenuData.mainText}
          contextMenuData={contextMenuData}
          disabled={disabled}
        />
      );
    case 'SmallDialogMenuItem':
      return (
        <ContextMenuSmallDialogItemComponent
          onClick={onClick}
          handleClose={handleClose}
          mainText={contextMenuData.mainText}
          contextMenuData={contextMenuData}
          disabled={disabled}
        />
      );
    case 'LargeMenuItem':
      return (
        <ContextMenuLargeItemComponent
          onClick={onClick}
          handleClose={handleClose}
          mainText={contextMenuData.mainText}
          subText={contextMenuData.subText}
          contextMenuData={contextMenuData}
          disabled={disabled}
        />
      );
    case 'LargeDialogMenuItem':
      return (
        <ContextMenuLargeDialogItemComponent
          onClick={onClick}
          handleClose={handleClose}
          mainText={contextMenuData.mainText}
          subText={contextMenuData.subText}
          contextMenuData={contextMenuData}
          disabled={disabled}
        />
      );
    default:
      return <></>;
  }
};

export default ContextMenuItemComponent;
