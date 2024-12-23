import EditorComponent from 'components/editor/EditorComponent';
import { content } from 'styles/workarea/Content';

/**
 * Studio 레이아웃에서 툴페인 등을 제외한 중앙의 공간.
 */
const ContentComponent: React.FC = () => {
  // const appStore = useEditorStore();
  // const isZoomBarShow = isEditableMode(appStore.getAppModeContainer());

  return (
    <div css={content}>
      <EditorComponent />
      {/* <ZoomNudgeMiniBarComponent /> */}
    </div>
  );
};

export default ContentComponent;
