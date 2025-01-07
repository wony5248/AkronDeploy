import ComponentInsertToolPane from 'components/toolpane/ComponentInsertToolPane';
import LeftToolPaneResizingBar from 'components/toolpane/LeftToolPaneResizingBar';
import PageSorterViewComponent from 'components/toolpane/PageSorterViewComponent';
import TreeToolPaneComponent from 'components/toolpane/TreeToolPaneComponent';
import useToolpaneResize from 'hooks/useToolpaneResize';
import { observer } from 'mobx-react-lite';
import { useState, useRef } from 'react';
import { baseLeftToolPane, leftResourceToolPane, leftToolPane } from 'styles/toolpane/LeftToolpane';

/**
 * Left ToolPane.
 */
const LeftToolpaneComponent: React.FC = () => {
  const [initialY, setInitialY] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const { ref, handlePointerMove, handlePointerDown, handlePointerUp, handleMouseMove } = useToolpaneResize();
  const [addLibraryDialogOpen, SetAddLibraryDialogOpen] = useState(false);

  const minTopToolPaneHeight = 100;

  const topToolPane = useRef<HTMLDivElement>(null);
  const bottomToolPane = useRef<HTMLDivElement>(null);
  const topToolPaneHeight = topToolPane.current?.clientHeight ?? 0;
  const bottomToolPaneHeight = bottomToolPane.current?.clientHeight ?? 0;

  //   const onClickAddLibrary = async (id: string /*, libraryType: LibraryType*/) => {
  //      const idValue = Number(id);
  //      await appStore.addLibraryToUsed(idValue, libraryType);
  //   };

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
          <PageSorterViewComponent ref={topToolPane} />
          <LeftToolPaneResizingBar setIsResizing={setIsResizing} setInitialY={setInitialY} />
          <TreeToolPaneComponent ref={bottomToolPane} />
        </div>
      </div>
      <ComponentInsertToolPane setAddLibraryDialogOpen={SetAddLibraryDialogOpen} />
      {/* <AddLibraryDialogComponent
                open={addLibraryDialogOpen}
                onClick={onClickAddLibrary}
                handleClose={() => {
                    SetAddLibraryDialogOpen(false);
                }}
                dialogType={LibraryDialogType.ALL}
            /> */}
    </div>
  );
};

export default observer(LeftToolpaneComponent);
