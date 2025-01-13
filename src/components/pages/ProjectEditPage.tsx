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
import { useParams } from 'react-router-dom';
import AppRepository from 'models/repository/AppRepository';
import AsyncComponent from 'components/common/AsyncComponent';
import LoadingComponent from 'components/common/LoadingComponent';
import AppModeContainer from 'models/store/container/AppModeContainer';
import AkronCommandMapper from 'models/store/command/akron/AkronCommandMapper';
import CommandHandlerFactory from 'models/store/command/factory/CommandHandlerFactory';
import AkronEventMapper from 'models/store/event/AkronEventMapper';
import EventHandlerFactory from 'models/store/event/factory/EventHandlerFactory';
import MetadataContainer from 'models/store/container/MetadataContainer';
// import AsyncComponent from 'components/common/AsyncComponent';
// import LoadingComponent from 'components/common/LoadingComponent';

/**
 * Store를 사용하기 위한 main page 내부 컴포넌트.
 * MainPageComponent가 store의 Provider이므로 이렇게 자식에서부터 store를 사용합니다.
 */
const MainPageContent: React.FC = observer(() => {
  return (
    <div
      css={[main /*isDragThumbnail && dragThumbnail*/]} // drag 동작 추가 시 style 적용
    >
      <TitleBarComponent>
        <AppNameComponent />
      </TitleBarComponent>
      <RibbonMenuComponent />
      <WorkAreaComponent />
    </div>
  );
});

/**
 * Editor Page를 나타내는 컴포넌트입니다.
 * 실제 프로젝트 수정에 관련된 모든 내용은 해당 컴포넌트에서 동작합니다.
 */
const MainPageComponent = () => {
  const { appId } = useParams();
  const getAppData = async () => {
    const appJson = await AppRepository.getAppJson(Number(appId));
    const metadatas = await AppRepository.getAppMetadatas({ appId: Number(appId) });

    const params: EditorStoreInitParams = {
      appId: Number(appId),
      eventMapper: new AkronEventMapper(new EventHandlerFactory()),
      mode: 'EDIT_APP',
      appName: '',
      appModeContainer: new AppModeContainer(),
      metadataContainer: new MetadataContainer(metadatas),
      commandMapper: new AkronCommandMapper(new CommandHandlerFactory()),
      appJson,
      appInfo: {
        type: 'ux',
        name: '',
        width: undefined,
        height: undefined,
      },
      contextMenuContainer: new ContextMenuContainer(),
      selectAtFirst: false,
    };

    return params;
  };

  const render = (params: EditorStoreInitParams) => {
    const contextMenuContainer = new ContextMenuContainer();
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

  return <AsyncComponent fallback={<LoadingComponent />} func={getAppData} render={render}></AsyncComponent>;
};

MainPageComponent.displayName = 'ProjectEditPage';

export default MainPageComponent;
