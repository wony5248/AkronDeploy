import sectionSelectedPropsHandler from 'components/toolpane/handler/ToolpaneSectionPropsHandler';
import EditorStore from 'models/store/EditorStore';
import { IRibbonTab } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import ToolPaneInsertTabData from 'store/toolpane/ToolPaneInsertTabData';

/*
 * ToolPane을 구성하는 Data
 */
export const ToolPaneData: IRibbonTab[] = [ToolPaneInsertTabData];

export const rightToolPaneTypeNames = [
  // Widget 기능 및 스타일 속성
  'Design',
  'Content',
  // Business logic 편집.
  'Logic',
  /*
    // Widget 기능 관련 속성 (properties.content).
    'Content',
    // Widget 스타일 관련 속성 (properties.style).
    'Style',
    
    */
  // 서비스 선택 툴페인
  'ServiceSelection',
  // 서비스 매핑 툴페인
  'ServiceMapping',
] as const;

/**
 * PropHandler의 반환 타입 정의
 */
export interface ToolPaneProp {
  disabled?: boolean;
  selected?: boolean;
}

/**
 * 각 툴페인의 종류를 나타냅니다.
 */
export type RightToolPaneType = (typeof rightToolPaneTypeNames)[number];

const leftToolPaneTypeNames = ['None', 'Component', 'Icon'] as const;

/**
 * 각 좌측 툴페인의 종류를 나타냅니다.
 */
export type LeftToolPaneType = (typeof leftToolPaneTypeNames)[number];

/**
 * 툴페인 display 속성 프로퍼티
 */
export interface IToolpaneDisplayProperties {
  display: 'none' | 'block';
}

/**
 * 툴페인 활성화/비활성화 핸들러 함수 타입 정의입니다.
 */
type toolPanePropsHandlerType = (editorStore: EditorStore) => ToolPaneProp;

const toolPanePropsHandlerMap: Partial<Record<RightToolPaneType, toolPanePropsHandlerType>> = {
  Content: sectionSelectedPropsHandler,
  // Style: sectionSelectedPropsHandler,
};

/**
 * toolpane type 를 통해 propHandler 를 반환
 */
export function getPropsHandler(toolPaneType: RightToolPaneType, editorStore: EditorStore): ToolPaneProp | undefined {
  const handler = toolPanePropsHandlerMap[toolPaneType];
  return handler ? handler(editorStore) : undefined;
}
