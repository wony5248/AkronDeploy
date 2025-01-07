import useEditorStore from 'hooks/useEditorStore';
import WidgetRepository from 'models/repository/WidgetRepository';
import AkronCommandMapper from 'models/store/command/akron/AkronCommandMapper';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandlerFactory from 'models/store/command/factory/CommandHandlerFactory';
import WidgetCommandProps from 'models/store/command/widget/WidgetCommandProps';
import {
  leftToolpaneTitle,
  leftToolpaneTitleButton,
  toolPaneCloseButton,
  toolPanePopupButton,
  toolPaneTitle,
  toolPaneTitleButtonGroup,
} from 'styles/toolpane/ToolPaneTitle';

/**
 * ToolPaneTitleComponent props.
 */
interface IProps {
  isLeftToolPane?: boolean;
  titleID: string;
  // true이면 드래그 시 포함된 창이 움직입니다.
  // 다만 겹친 element들이 있으면 마우스 이벤트에 영향을 줄 수 있습니다.
  isDraggable: boolean;
  showPopupButton: boolean;
  showCloseButton: boolean;
  showPlusButton: boolean;
  plusButtonLogicType?: string;
  onClickPopupButton?: () => void;
  onClickCloseButton?: () => void;
  onClickBackButton?: () => void;
}

/**
 * 각 툴페인의 제목 표시줄에 해당합니다.
 * 툴페인의 이름과 팝업 버튼, 닫기 버튼 등이 들어있습니다.
 */
const ToolPaneTitleComponent: React.FC<IProps> = ({
  isLeftToolPane = false,
  titleID,
  isDraggable,
  showPopupButton,
  showCloseButton,
  showPlusButton,
  plusButtonLogicType,
  onClickPopupButton,
  onClickCloseButton,
  onClickBackButton,
}: IProps) => {
  const editorStore = useEditorStore();
  const editorUIStore = editorStore.getEditorUIStore();

  // const title = useTextResource(titleID);
  let onClickPlusButton;

  if (plusButtonLogicType === 'AddPage') {
    onClickPlusButton = () => {
      const commandProps: WidgetCommandProps = {
        commandID: CommandEnum.WIDGET_RESIZE_END,
        selectionProp: editorStore.getEditingWidgetModel(),
      };
      editorStore.handleCommandEvent(commandProps);
    };
  } else if (plusButtonLogicType === 'InsertComponent') {
    onClickPlusButton = () => {
      if (editorUIStore.getActiveLeftToolPaneType() === 'None') {
        editorUIStore.setActiveLeftToolPaneType('Component');
      } else {
        editorUIStore.setActiveLeftToolPaneType('None');
      }
    };
  }

  return (
    <div css={isLeftToolPane ? leftToolpaneTitle : toolPaneTitle(isDraggable)}>
      <div>
        {titleID === 'MSG_CM_TLP_TITLE_SERVICE_MAPPING' && (
          <button css={toolPanePopupButton} type={'button'} aria-label={'Back'} onClick={onClickBackButton}>
            {/* <ImageResourceComponent id={'IC_TOOLPANE_ARROW_BACK'} w={'16px'} h={'16px'} /> */}
            <div style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>
      {'title'}
      <div css={toolPaneTitleButtonGroup}>
        {showPopupButton && (
          <button css={toolPanePopupButton} type={'button'} aria-label={'Popup'} onClick={onClickPopupButton}>
            {/* <ImageResourceComponent id={'IC_L_TOOLPANE_SEPARATION'} w={'16px'} h={'16px'} /> */}
            <div style={{ width: '16px', height: '16px' }} />
          </button>
        )}
        {showCloseButton && (
          <button css={toolPaneCloseButton} type={'button'} aria-label={'Close'} onClick={onClickCloseButton}>
            {/* <ImageResourceComponent id={'IC_L_TOOLPANE_CLOSE'} w={'16px'} h={'16px'} /> */}
            <div style={{ width: '16px', height: '16px' }} />
          </button>
        )}
        {showPlusButton && (
          <button
            css={isLeftToolPane ? leftToolpaneTitleButton : toolPanePopupButton}
            type={'button'}
            aria-label={'Popup'}
            onClick={onClickPlusButton}
          >
            {/* <ImageResourceComponent id={'IC_TOOLPANE_PAGEADD'} w={'16px'} h={'16px'} /> */}
            <div style={{ width: '16px', height: '16px' }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolPaneTitleComponent;
