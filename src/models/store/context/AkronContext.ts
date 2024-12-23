import SelectionContainer from '../container/SelectionContainer';
import CommandEnum from '../command/common/CommandEnum';
import { SelectionProp } from '../command/common/WidgetCommandProps';
import Context from './Context';
import AppContextBase from 'models/store/context/ContextBase';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import WidgetCommandProps from 'models/store/command/common/WidgetCommandProps';

/**
 * DOM으로부터 얻은 page의 좌표(browser 기준)
 * width, height은 style에 있음
 */
interface PageRefPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 현재 편집 중인 app의 정보 및 편집기의 상태들을 담고 있습니다.
 * AppStore는 command, event 등의 로직들을 현재의 AppContext 값 위에 정해진 순서대로 적용하는 형태로 작동합니다.
 * (CM/C (Component Manager / Component) 구조)
 */
interface AkronContext extends AppContextBase, Context<WidgetID, CommandEnum, SelectionProp> {
  /**
   * 현재 수정중인 widget의 model입니다.
   * (ex. App or Composite or BusinessDialog widget)
   */
  editingWidgetModel: WidgetModel;

  /**
   * UX 프로젝트에서 LeftToolpane 기본 요소 탭에 표시될 컴포넌트들에 대한 라이브러리 정보입니다.
   * 현재 UXPin에 대한 라이브러리만 제공되며, 추후 다른 라이브러리 추가 시 자료구조 변경 필요.
   */
  //   presetLibraryInfo: ILibraryInfo;

  /**
   * 현재 프로젝트에서 등록한 라이브러리에 대한 정보입니다.
   */
  //   registeredLibraryInfoMap: Record<LibraryType, Map<number, ILibraryInfo>>;

  /**
   * High Level Studio에서 등록한 라이브러리에 대한 정보입니다.
   */
  //   registeredHighLevelLibraryInfoMap: Record<LibraryType, Map<number, ILibraryInfo>>;

  /**
   * 사용자가 제작한 composite widget들의 목록(ordered map)입니다.
   */
  //   registeredCompositeWidgetMap: Map<WidgetID, WidgetModel<IComponentCommonProperties, ICompositeWidgetProperties>>;

  /**
   * 현재 event 의 command id 와 handling 에 필요한 요소들을 나타냅니다. 휘발적이며 event 마다 초기화 됩니다.
   */
  commandProps?: WidgetCommandProps;

  /**
   * 현재 App의 이름을 나타냅니다.
   */
  appName: string;

  /**
   * Mouse Event로 드래깅 시 Hit 정보들을 저장하는 Container 입니다.
   */
  //   hitContainer: HitContainer<WidgetModel>;

  /**
   * 현재 선택된 Selection 정보
   */
  selectionContainer?: SelectionContainer;

  /**
   * 이전에 선택된 Selection 정보
   */
  prevSelectionContainer?: SelectionContainer;

  /**
   * Clipboard 정보
   */
  //   clipboardContainer: ClipboardContainer;

  /**
   * 현재 Selection을 바탕으로, 업데이트되어야 할 Style의 정보를 보관합니다.
   */
  //   propContainer: PropContainer;

  /**
   * 모드 변경 전, 마지막으로 선택된 Selection 정보
   */
  editModeLastSelectionContainer?: SelectionContainer;

  /**
   * WidgetEditModelInfoContainer
   * App에 배치 된 Widget을 끌어서 이동/리사이즈 할 유지되어야 하는 정보들을 보관합니다.
   */
  //   widgetEditInfoContainer: WidgetEditInfoContainer;

  /**
   * ContextMenuContainer
   * Context menu에 필요한 내용을 관리합니다..
   */
  //   contextMenuContainer: ContextMenuContainer;

  /**
   * ErrorBoundaryContainer
   * 속성 값 오류로 인해 렌더링 오류가 발생한 WidgetModel들을 관리합니다..
   */
  //   errorBoundaryContainer: ErrorBoundaryContainer;

  /**
   * 저장 상태를 나타냅니다.
   */
  //   saveState: SaveState;

  /**
   * 저장 작업 진행중일 때, 해당 저장 작업 이후 다시 저장 작업이 필요한지를 나타냅니다.
   */
  needSaveState: boolean;

  /**
   * UpdateMessage를 보관합니다.
   * 전송이 될 경우, Message를 비우고, 다시 생성하여 채웁니다.
   */
  //   updateMessageContainer: UpdateMessageContainer<WidgetID>;

  //   user: UserModel;

  /**
   * 룸 id를 나타냅니다.
   */
  roomID: number;

  /**
   * 룸 목록을 나타냅니다.
   */
  //   roomList: RoomModel[];

  /**
   * 마지막으로 문서가 저장된 시간을 나타냅니다.
   */
  lastSavedTime?: Date;

  /**
   * 페이지에 관련된 정보들을 담고 있습니다.
   */
  //   pageContainer: PageContainer;

  /**
   * 편집 UI 관련 공통 상태들을 관리하는 Store
   */
  //   editorUIStore: EditorUIStore;

  /**
   * 마지막으로 저장된 edit mode undostack 의 tag
   */
  lastRegisteredEditUndoStackTag: string;

  /**
   * zoom ratio를 나타냅니다.
   */
  zoomRatio: number;

  /**
   * 화면 맞춤 여부를 나타냅니다.
   */
  isFitWindow: boolean;

  /**
   * 작업중인 page의 ref로부터 얻어온 page의 좌표값
   */
  editingPageRefPosition: PageRefPosition;

  /*
   * Smart Guide 관련 정보가 있는 container
   */
  //   smartGuideContainer: SmartGuideContainer;

  /**
   * OS object ID를 나타냅니다.
   */
  OSobjectID?: number;

  /**
   * drag하고 있는 object의 type.
   * 추후 drag되는 type 추가 시 DragContainer 등으로 분리하고 고도화가 필요함
   */
  dragObject: 'Thumbnail' | 'Section' | undefined;

  /**
   * 특정 동작을 하게 되는 마우스 상태
   */
  mouseMode: 'Normal' | 'InsertContainer';

  // 서버 통신 중인 메세지 관련 상태.
  saved: boolean;

  // 띄울 dialog type.
  // 현재 리본에서는 버튼이 dialog를 소유하고 open 여부를 결정하는데,
  // 추후 Editor에서처럼 아래 변수를 이용해 type 결정 및 open 여부를 context에서 해야 함
  //   dialogType: dialogContentType | undefined;

  // dialog open 여부.
  dialogOpen: boolean;

  // drag&drop 할때 drop된 위치의 targetModel
  dragDesModel?: WidgetModel;

  // appReadOnlyContext
  //   appReadOnlyContext: AppReadOnlyContext;
}

export default AkronContext;
