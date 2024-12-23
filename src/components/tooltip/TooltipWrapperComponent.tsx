// import styles from 'common/style/tooltip/Tooltip.scss';
import TooltipComponent from 'components/tooltip/TooltipComponent';
import useEditorStore from 'hooks/useEditorStore';
import useTooltip from 'hooks/useTooltip';
import { observer } from 'mobx-react-lite';
import { tooltipWrapper } from 'styles/tooltip/Tooltip';

/**
 * TooltipStore의 변화를 감지하여 tooltip의 visibility와 위치를 설정합니다.
 */
const TooltipWrapperComponent = () => {
  const editorStore = useEditorStore();
  const tooltipStore = editorStore.getTooltipStore();
  const { tooltipRef, showTooltipWithDelay, hideTooltipWithDelay } = useTooltip(editorStore);

  return (
    <div
      ref={tooltipRef}
      style={{
        visibility: tooltipStore.getIsVisible() ? 'visible' : 'hidden',
      }}
      css={tooltipWrapper}
      onMouseEnter={showTooltipWithDelay}
      onMouseLeave={hideTooltipWithDelay}
    >
      <TooltipComponent />
    </div>
  );
};

export default observer(TooltipWrapperComponent);
