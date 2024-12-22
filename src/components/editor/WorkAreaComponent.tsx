import { WidgetCreatorComponent } from 'akron_runner';
// import useEditorStore from 'hooks/useEditorStore';
import { WorkAreaStyle } from 'styles/editor/WorkAreaStyle';

/**
 * Editor Page 내에서 좌측 패널, 우측 패널을 제외한 실제 작업 영역을 나타내는 컴포넌트입니다.
 */
const WorkAreaComponent = () => {
  // const editorStore = useEditorStore();

  return (
    <section css={WorkAreaStyle}>
      <WidgetCreatorComponent widgetModel={{}} />
    </section>
  );
};

WorkAreaComponent.displayName = 'WorkAreaComponent';

export default WorkAreaComponent;
