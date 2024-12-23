import { observer } from 'mobx-react-lite';

/**
 * 제목 표시줄 등에 현재 편집 중인 앱의 정보를 표시하기 위한 component.
 */
const AppNameComponent: React.FC = () => {
  // const ediStore = useEditorStore();
  // const appName = appStore.getAppWidgetModel().getName();

  return <>Akron</>;
};

export default observer(AppNameComponent);
