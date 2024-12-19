import EditorStore, { EditorStoreInitParams, EditorStoreProvider } from 'models/store/EditorStore';

import EditorComponent from 'components/editor/EditorComponent';
import WorkAreaComponent from 'components/editor/WorkAreaComponent';
// import AsyncComponent from 'components/common/AsyncComponent';
// import LoadingComponent from 'components/common/LoadingComponent';

/**
 * Editor Page를 나타내는 컴포넌트입니다.
 * 실제 프로젝트 수정에 관련된 모든 내용은 해당 컴포넌트에서 동작합니다.
 */
const MainPageComponent = () => {
  const render = (params: EditorStoreInitParams) => {
    const editorStore = new EditorStore(params);

    return (
      <EditorStoreProvider value={editorStore}>
        <EditorComponent>
          <WorkAreaComponent />
        </EditorComponent>
      </EditorStoreProvider>
    );
  };

  // TODO: API로 서버에서 앱 첫 렌더를 위한 내용 받아오는거 작성 필요
  // return (
  //   <AsyncComponent
  //     fallback={<LoadingComponent />}
  //     func={() => }
  //     render={render}
  //   ></AsyncComponent>
  // );

  return <>{render({})}</>;
};

MainPageComponent.displayName = 'ProjectEditPage';

export default MainPageComponent;
