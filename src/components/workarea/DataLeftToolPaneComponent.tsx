import DataTabMenuComponent from 'components/toolpane/DataTabMenuComponent';
import useToolpaneResize from 'hooks/useToolpaneResize';
import { useRef, useState } from 'react';
import { baseLeftToolPane, leftResourceToolPane, leftToolPane } from 'styles/toolpane/LeftToolpane';

/**
 * Left ToolPane.
 */
const DataLeftToolPaneComponent: React.FC = () => {
  const [initialY, setInitialY] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const { ref, handlePointerMove, handlePointerDown, handlePointerUp, handleMouseMove } = useToolpaneResize();

  const minTopToolPaneHeight = 100;

  const topToolPane = useRef<HTMLDivElement>(null);
  const bottomToolPane = useRef<HTMLDivElement>(null);
  const topToolPaneHeight = topToolPane.current?.clientHeight ?? 0;
  const bottomToolPaneHeight = bottomToolPane.current?.clientHeight ?? 0;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isResizing) {
      return;
    }

    const deltaY = e.clientY - initialY;
    const verticalResizingBarHeight = 10;
    const totalHeight = ref.current?.clientHeight ?? 0;
    const topToolPaneNewHeight = topToolPaneHeight + deltaY;
    const bottomToolPaneNewHeight = bottomToolPaneHeight - deltaY;

    if (topToolPaneNewHeight > minTopToolPaneHeight && bottomToolPaneNewHeight > minTopToolPaneHeight) {
      if (topToolPane.current !== null && bottomToolPane.current !== null) {
        topToolPane.current.style.height = `calc(${(topToolPaneNewHeight / totalHeight) * 100}% - ${
          verticalResizingBarHeight / 2
        }px)`;
        bottomToolPane.current.style.height = `calc(${(bottomToolPaneNewHeight / totalHeight) * 100}% - ${
          verticalResizingBarHeight / 2
        }px)`;
      }
    }
  };

  return (
    <div css={leftToolPane} onMouseMove={handleMouseMove} onPointerDown={handlePointerDown}>
      <div css={leftResourceToolPane}>
        <div
          css={baseLeftToolPane}
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseUp={() => {
            setIsResizing(false);
          }}
          onMouseLeave={() => {
            setIsResizing(false);
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <DataTabMenuComponent />
        </div>
      </div>
    </div>
  );
};

export default DataLeftToolPaneComponent;
