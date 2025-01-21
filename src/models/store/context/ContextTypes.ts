import AppModel from 'models/node/AppModel';
import { WidgetID } from 'models/node/WidgetModel';
import AppModeContainer from 'models/store/container/AppModeContainer';
import CompositeComponentContainer from 'models/store/container/CompositeComponentContainer';
import MetadataContainer from 'models/store/container/MetadataContainer';
import EventState from 'models/store/event/EventState';
import { AppInfo } from 'store/app/AppInfo';
import EditorUIStore from 'store/app/EditorUIStore';
import ContextMenuContainer from 'store/context-menu/ContextMenuContainer';
import { LeftToolPaneType } from 'store/toolpane/ToolPaneComponentInfo';

/**
 * AppContextInitilizeProp
 */
export interface ContextInitializeProp {
  appID: WidgetID;
  newAppModel: AppModel;
  appInfo: AppInfo;
  compositeComponentContainer: CompositeComponentContainer;
  eventState: EventState;
  appName: string;
  appModeContainer: AppModeContainer;
  startPageID: number;
  startPageURL: string;
  contextMenuContainer: ContextMenuContainer;
  metadataContainer: MetadataContainer;
  activeLeftToolPaneType?: LeftToolPaneType;
  editorUIStore: EditorUIStore;
  startElementId: number;
}

/**
 * 프로젝트의 스크롤 위치
 */
export interface PageScroll {
  left: number;
  top: number;
}
/**
 * MouseModeType
 */
export type MouseModeType = 'Normal' | 'InsertContainer';

/**
 * DragObjectType
 */
export type DragObjectType = 'Thumbnail' | 'Section' | undefined;
