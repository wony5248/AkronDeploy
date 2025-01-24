import ImageResourceComponent from 'components/common/ImageResourceComponent';
import useEditorStore from 'hooks/useEditorStore';
import WidgetRepository from 'models/repository/WidgetRepository';
import {
  toolPaneComponentButton,
  toolPaneComponentButtonImage,
  toolPaneComponentButtonLabel,
  toolPaneComponentButtonLabelWrapper,
  toolPaneComponentButtonWrapper,
} from 'styles/toolpane/ComponentInsertToolpane';

/**
 * Ribbon Button props.
 */
interface IProps {
  label: string;
  image: string;
  commandType: string;
  commandPropName: string;
  tooltip: string;
  disabled: boolean;
  selected?: boolean;

  // 탭을 클릭할 경우의 handler.
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
}

/**
 * 툴페인 내 각 Button을 나타내는 component.
 */
const ToolPaneComponentButton: React.FC<IProps> = (props: IProps) => {
  const { label, image, commandType, commandPropName, tooltip, disabled, selected, onClick } = props;
  const editorStore = useEditorStore();
  const tooltipStore = editorStore.getTooltipStore();
  const handleClick = () => {
    onClick(commandPropName, commandType);
  };

  return (
    <div css={toolPaneComponentButton}>
      <div
        css={toolPaneComponentButtonWrapper(disabled, selected ?? false)}
        onClick={handleClick}
        onMouseEnter={e => {
          tooltipStore.openTooltip(e, 'topCenter', {
            title: e.currentTarget.innerText,
          });
        }}
        onDragStart={e => {
          e.dataTransfer.setData('widgetId', String(WidgetRepository.generateWidgetID()));
          e.dataTransfer.setData('widgetType', commandPropName);
          e.dataTransfer.effectAllowed = 'copy';
        }}
        draggable="true"
      >
        <div css={toolPaneComponentButtonImage}>
          <ImageResourceComponent id={image} w={'32px'} h={'32px'} />
          {/* <button style={{ width: '32px', height: '32px' }} /> */}
        </div>
        <div css={toolPaneComponentButtonLabelWrapper}>
          <div css={toolPaneComponentButtonLabel}>{/*useTextResource(label)*/ label}</div>
        </div>
      </div>
    </div>
  );
};

export default ToolPaneComponentButton;
