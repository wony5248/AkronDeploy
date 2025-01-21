import EditorComponent from 'components/editor/EditorComponent';
import { content } from 'styles/workarea/Content';

/**
 * Studio 레이아웃에서 툴페인 등을 제외한 중앙의 공간.
 */
const ContentComponent: React.FC = () => {
  return (
    <div css={content}>
      <EditorComponent />
    </div>
  );
};

export default ContentComponent;
