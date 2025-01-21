import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';

/**
 * 제목 표시줄 등에 현재 편집 중인 앱의 정보를 표시하기 위한 component.
 */
const AppNameComponent: React.FC = () => {
  const editorStore = useEditorStore();
  const appName = editorStore.getAppModel()?.getName() ?? 'Akron';

  return <>{appName}</>;
};

export default observer(AppNameComponent);
