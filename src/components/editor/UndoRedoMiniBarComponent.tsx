import ImageResourceButtonComponent from 'components/common/ImageResourceButtonComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import CommandEnum from 'models/store/command/common/CommandEnum';
import {
  basicColor,
  disableColor,
  miniZoomNudgeWrapper,
  redoButtonWrapper,
  undoButtonWrapper,
} from 'styles/editor/UndoRedoMiniBar';

/**
 * Editor 영역 내에 있는 undo/redo 기능을 수행하는 component
 */
const UndoRedoMiniBarComponent: React.FC = observer(() => {
  const editorStore = useEditorStore();
  // const undoDisable = undoComponentDisabledPropsHandler(editorStore).disabled ?? true;
  // const redoDisable = redoComponentDisabledPropsHandler(editorStore).disabled ?? true;

  return (
    <div css={miniZoomNudgeWrapper}>
      <div css={undoButtonWrapper}>
        <ImageResourceButtonComponent
          onClick={() => {
            editorStore.handleCommandEvent({
              commandID: CommandEnum.UNDO,
            });
          }}
          w={'13px'}
          h={'13px'}
          id={'IC_BACK'}
          // imagecss={undoDisable ? disableColor : basicColor}
          // disabled={undoDisable}
        />
      </div>
      <div css={redoButtonWrapper}>
        <ImageResourceButtonComponent
          onClick={() => {
            editorStore.handleCommandEvent({
              commandID: CommandEnum.REDO,
            });
          }}
          w={'13px'}
          h={'13px'}
          id={'IC_FORWARD'}
          // imagecss={disableColor}
        />
      </div>
    </div>
  );
});

export default UndoRedoMiniBarComponent;
