import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { miniZoomNudgeWrapper, redoButtonWrapper, undoButtonWrapper } from 'styles/editor/UndoRedoMiniBar';

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
        {/* <ImageResourceButtonComponent
                    onClick={() => {
                        editorStore.handleCommandEvent({
                            commandID: CommandEnum.UNDO,
                        });
                    }}
                    w={'18px'}
                    h={'15px'}
                    id={'IC_BACK'}
                    imageClassName={undoDisable ? disableColor : basicColor}
                    disabled={undoDisable}
                /> */}
        <button style={{ width: '18px', height: '15px' }} />
      </div>
      <div css={redoButtonWrapper}>
        {/* <ImageResourceButtonComponent
                    onClick={() => {
                        editorStore.handleCommandEvent({
                            commandID: CommandEnum.REDO,
                        });
                    }}
                    w={'18px'}
                    h={'15px'}
                    id={'IC_FORWARD'}
                    imageClassName={redoDisable ? disableColor : basicColor}
                    disabled={redoDisable}
                /> */}
        <button style={{ width: '18px', height: '15px' }} />
      </div>
    </div>
  );
});

export default UndoRedoMiniBarComponent;
