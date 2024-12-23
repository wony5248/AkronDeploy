import EditorStore, { EditorStoreInitParams, EditorStoreProvider } from 'models/store/EditorStore';

import WorkAreaComponent from 'components/editor/WorkAreaComponent';
import { useState } from 'react';
import ContextMenuContainer, { ContextMenuProvider } from 'store/context-menu/ContextMenuContainer';
import TooltipWrapperComponent from 'components/tooltip/TooltipWrapperComponent';
import ContextMenuWrapperComponent from 'components/context-menu/ContextMenuWrapperComponent';
import ContextMenuContentComponent from 'components/context-menu/ContextMenuContentComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import TitleBarComponent from 'components/common/TitleBarComponent';
import AppNameComponent from 'components/pages/AppNameComponent';
import RibbonMenuComponent from 'components/ribbon-menu/RibbonMenuComponent';
import { dragThumbnail, main } from 'styles/Main';
// import AsyncComponent from 'components/common/AsyncComponent';
// import LoadingComponent from 'components/common/LoadingComponent';

/**
 * Store를 사용하기 위한 main page 내부 컴포넌트.
 * MainPageComponent가 store의 Provider이므로 이렇게 자식에서부터 store를 사용합니다.
 */
const MainPageContent: React.FC = observer(() => {
  const editorStore = useEditorStore();
  // const isEditMode = appStore.isEditableMode();

  // document.body.classList.add(variable.gxApp);

  const [isDragThumbnail, setIsDragThumbnail] = useState(false);
  // const handleMouseMove = (e: React.MouseEvent) => {
  //     // drag event로 사용
  //     if (e.buttons === 1) {
  //         const target = e.target as HTMLElement;
  //         if (
  //             // 일부 element의 경우 className이 없어 object형식으로 나옴
  //             appStore.getDragObject() === 'Thumbnail' &&
  //             (typeof target.className !== 'string' || target.className.includes('PageWidgetList') === false)
  //         ) {
  //             setIsDragThumbnail(true);
  //         } else {
  //             setIsDragThumbnail(false);
  //         }
  //     }
  // };

  // const handleMouseUp = () => {
  //     setIsDragThumbnail(false);
  // };

  // const handleMouseDown = () => {
  //     // page가 아닌 곳에서는 mouse mode 해제
  //     appStore.setMouseMode('Normal');
  // };

  // isGXEditAppMode
  return (
    // <AppStylesWrapper globalCSSs={appStore.getAllGlobalCSSs()}>
    //     {/* HotKeyWrapper가 내부적으로 div를 생성하기 때문에, main의 style(ex. flex)이 의도한 대로 child들을 배치하도록 HotKeyWrapper를 main보다 밖에 둠. */}
    //     <GlobalHotKeyWrapper>
    <div
      css={[main, isDragThumbnail && dragThumbnail]}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
      // onMouseDown={handleMouseDown}
    >
      <TitleBarComponent>
        <AppNameComponent />
      </TitleBarComponent>
      <RibbonMenuComponent />
      <WorkAreaComponent />
    </div>
    //     {/* </GlobalHotKeyWrapper>
    // </AppStylesWrapper> */}
  );
});

/**
 * Editor Page를 나타내는 컴포넌트입니다.
 * 실제 프로젝트 수정에 관련된 모든 내용은 해당 컴포넌트에서 동작합니다.
 */
const MainPageComponent = () => {
  const [contextMenuContainer] = useState(() => new ContextMenuContainer());
  const render = (params: EditorStoreInitParams) => {
    const editorStore = new EditorStore(params);
    return (
      <EditorStoreProvider value={editorStore}>
        <ContextMenuProvider value={contextMenuContainer}>
          <TooltipWrapperComponent />
          <ContextMenuWrapperComponent>
            <ContextMenuContentComponent />
          </ContextMenuWrapperComponent>
          <MainPageContent />
        </ContextMenuProvider>
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
