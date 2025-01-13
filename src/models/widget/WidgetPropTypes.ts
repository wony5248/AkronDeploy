import { PageItem } from 'components/toolpane/PageListComponent';
import WidgetModel, { WidgetID, WidgetTypeID } from 'models/node/WidgetModel';
import { CSSProperties } from 'react';

/**
 * 비즈니스 컴포넌트 체인 ID
 */
export type ChainID = number;
/**
 * 컴포넌트 이벤트 핸들러 ID
 */
export type HandlerID = number;

/**
 * Widget이 가지는 Prop의 MetaData 정보
 */
export interface WidgetPropMetaData {
  name: string;
  dataType: number; // VERSION2_TODO: 추후 설계 및 구체화 예정
  defaultValue: any;
  displayName: string;
  control: PropControlTypes;
  controlInfo?: ControlInfo;
  controlDependency?: ControlDependency;
  controlSubComponentCount?: ControlSubComponentCount;
  objectTypeMetaId: number | null;
  isList: boolean;
  // propDetail: any; // VERSION2_TODO: 추후 설계 및 구체화 예정
}

/**
 * Control의 Option을 설정하는 추가 정보
 */
export type ControlInfo = DropdownOption[] | SpinnerOption;

/**
 * Control의 Dependency를 설정하는 추가 정보
 * 다른 prop이 특정 value일 때만 노출되기 원할 경우 설정
 * [propTypeId: WidgetPropTypeID, validValues: any[]][] 의 형태
 */
export type ControlDependency = [WidgetPropTypeID, any[]][];

/**
 * Control이 관리하는 Component를 설정하는 추가 정보
 * Prop 값의 변경에 따라 다른 component의 삽입/삭제를 관리해야 할 때 사용됨
 * [subComponentTypeId: WidgetTypeID, subComponentType:string][] 의 형태
 */
export type ControlSubComponentCount = [WidgetTypeID, string][];

/**
 * DropDown Control의 Option을 설정하는 추가 정보
 */
export interface DropdownOption {
  label: string;
  value: any;
}

/**
 * Spinner Control의 Option을 설정하는 추가 정보
 */
export interface SpinnerOption {
  min?: number;
  max?: number;
  defaultValue: number;
}

/**
 * Prop을 수정하는 Control의 type 정보
 */
export type PropControlTypes =
  | 'TextField'
  | 'DropDown'
  | 'Spinner'
  | 'ColorPicker'
  | 'TreeObject'
  | 'Object'
  | 'SubComponentCount'
  | 'CellTypeDropDown'
  | 'ConditionalControl'
  | 'Date'
  | 'None';

/**
 * Parent Prop 정보
 *
 * FIXME:
 * 최상위에만 custom prop 정의 가능하다면 parentId 필요 없음
 * composite component 중첩 가능 여부 확인 필요
 */
export interface IParentPropInfo {
  parentId: WidgetID;
  propId: WidgetPropID;
}

/**
 * Prop Binding을 위한 인터페이스
 */
export interface IWidgetBindingPropInfo {
  widgetModel: WidgetModel;
  propId: WidgetPropID;
  chainId?: ChainID;
}

/**
 * Widget의 Style요소. WidgetComponent의 render 시 CSS 생성에 사용됨
 * 주의) CSSProperties이 아님
 * e.g) width: 'auto'|'length'| ... (X), width: number (O)
 */
export type WidgetStyle = {
  // 속성 파싱 때 속성 key에 임의의 string을 넣을 수 있게 해주기 위함
  [key: string]: any;
  x: Position;
  y: Position;
  width: Length;
  height: Length;
  frameType: 'absolute' | 'relative';
  left: Constraint;
  top: Constraint;
  right: Constraint;
  bottom: Constraint;
  alignItems?: CSSProperties['alignItems'];
  alignSelf?: CSSProperties['alignSelf'];
  all?: CSSProperties['all'];
  animation?: string;
  animationDelay?: string;
  animationDirection?: string;
  animationDuration?: string;
  animationFillMode?: string;
  animationIterationCount?: string;
  animationName?: string;
  animationPlayState?: string;
  animationTimingFunction?: string;
  backfaceVisibility?: CSSProperties['backfaceVisibility'];
  background?: string;
  backgroundAttachment?: string;
  backgroundBlendMode?: string;
  backgroundClip?: string;
  backgroundColor?: Color;
  backgroundImage?: string;
  backgroundOrigin?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  border?: string;
  borderBottom?: string;
  borderBottomColor?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  borderBottomStyle?: CSSProperties['borderBottomStyle'];
  borderBottomWidth?: string;
  borderCollapse?: CSSProperties['borderCollapse'];
  borderColor?: string;
  borderImage?: string;
  borderImageOutset?: string;
  borderImageRepeat?: string;
  borderImageSlice?: string;
  borderImageSource?: string;
  borderImageWidth?: string;
  borderLeft?: string;
  borderLeftColor?: string;
  borderLeftStyle?: CSSProperties['borderLeftStyle'];
  borderLeftWidth?: string;
  borderLocation?: string;
  borderRadius?: string;
  borderRight?: string;
  borderRightColor?: string;
  borderRightStyle?: CSSProperties['borderRightStyle'];
  borderRightWidth?: string;
  borderSpacing?: string;
  borderStyle?: string;
  borderTop?: string;
  borderTopColor?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderTopStyle?: CSSProperties['borderTopStyle'];
  borderTopWidth?: string;
  borderWidth?: string;
  boxDecorationBreak?: CSSProperties['boxDecorationBreak'];
  boxShadow?: string;
  boxSizing?: CSSProperties['boxSizing'];
  breakAfter?: CSSProperties['breakAfter'];
  breakBefore?: CSSProperties['breakBefore'];
  breakInside?: CSSProperties['breakInside'];
  captionSide?: CSSProperties['captionSide'];
  caretColor?: string;
  clear?: CSSProperties['clear'];
  clip?: string;
  color?: string;
  columnCount?: CSSProperties['columnCount'];
  columnFill?: CSSProperties['columnFill'];
  columnGap?: string;
  columnRule?: string;
  columnRuleColor?: string;
  columnRuleStyle?: string;
  columnRuleWidth?: string;
  columnSpan?: CSSProperties['columnSpan'];
  columnWidth?: string;
  columns?: string;
  content?: string;
  counterIncrement?: string;
  counterReset?: string;
  cursor?: string;
  direction?: CSSProperties['direction'];
  display?: CSSProperties['display'];
  emptyCells?: CSSProperties['emptyCells'];
  filter?: string;
  flex?: string;
  flexBasis?: CSSProperties['flexBasis'];
  flexDirection?: CSSProperties['flexDirection'];
  flexFlow?: string;
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: CSSProperties['flexWrap'];
  float?: CSSProperties['float'];
  font?: string;
  fontFamily?: string;
  fontFeatureSettings?: string;
  fontKerning?: CSSProperties['fontKerning'];
  fontLanguageOverride?: string;
  fontSize?: string;
  fontSizeAdjust?: number | 'none';
  fontStretch?: string;
  fontStyle?: string;
  fontSynthesis?: string;
  fontVariant?: string;
  fontVariantAlternates?: string;
  fontVariantCaps?: CSSProperties['fontVariantCaps'];
  fontVariantEastAsian?: string;
  fontVariantLigatures?: string;
  fontVariantNumeric?: string;
  fontVariantPosition?: CSSProperties['fontVariantPosition'];
  fontWeight?: CSSProperties['fontWeight'];
  gap?: string;
  grid?: string;
  gridArea?: string;
  gridAutoColumns?: string;
  gridAutoFlow?: string;
  gridAutoRows?: string;
  gridColumn?: string;
  gridColumnEnd?: string;
  gridColumnGap?: string;
  gridColumnStart?: string;
  gridGap?: string;
  gridRow?: string;
  gridRowEnd?: string;
  gridRowGap?: string;
  gridRowStart?: string;
  gridTemplate?: string;
  gridTemplateAreas?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  hangingPunctuation?: string;
  // height?: string;
  hyphens?: CSSProperties['hyphens'];
  imageRendering?: CSSProperties['imageRendering'];
  isolation?: CSSProperties['isolation'];
  justifyContent?: CSSProperties['justifyContent'];
  letterSpacing?: string;
  lineBreak?: CSSProperties['lineBreak'];
  lineHeight?: string;
  listStyle?: string;
  listStyleImage?: string;
  listStylePosition?: CSSProperties['listStylePosition'];
  listStyleType?: string;
  margin?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  mask?: string;
  maskClip?: string;
  maskComposite?: string;
  maskImage?: string;
  maskMode?: string;
  maskOrigin?: string;
  maskPosition?: string;
  maskRepeat?: string;
  maskSize?: string;
  maskType?: CSSProperties['maskType'];
  maxHeight?: Length;
  maxWidth?: Length;
  minHeight?: Length;
  minWidth?: Length;
  mixBlendMode?: CSSProperties['mixBlendMode'];
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: string;
  opacity?: string;
  order?: number;
  orphans?: number;
  outline?: string;
  outlineColor?: string;
  outlineOffset?: string;
  outlineStyle?: string;
  outlineWidth?: string;
  overflowWrap?: CSSProperties['overflowWrap'];
  overflowX?: CSSProperties['overflowX'];
  overflowY?: CSSProperties['overflowY'];
  padding?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  pageBreakAfter?: CSSProperties['pageBreakAfter'];
  pageBreakBefore?: CSSProperties['pageBreakBefore'];
  pageBreakInside?: CSSProperties['pageBreakInside'];
  perspective?: string;
  perspectiveOrigin?: string;
  pointerEvents?: CSSProperties['pointerEvents'];
  position?: CSSProperties['position'];
  quotes?: string;
  resize?: CSSProperties['resize'];
  rowGap?: string;
  scrollBehavior?: CSSProperties['scrollBehavior'];
  tabSize?: string;
  tableLayout?: CSSProperties['tableLayout'];
  textAlign?: CSSProperties['textAlign'];
  textAlignLast?: CSSProperties['textAlignLast'];
  textCombineUpright?: string;
  textDecoration?: string;
  textDecorationColor?: string;
  textDecorationLine?: string;
  textDecorationStyle?: CSSProperties['textDecorationStyle'];
  textIndent?: string;
  textJustify?: CSSProperties['textJustify'];
  textOrientation?: CSSProperties['textOrientation'];
  textOverflow?: string;
  textShadow?: string;
  textTransform?: CSSProperties['textTransform'];
  textUnderlinePosition?: string;
  transform?: string;
  transformOrigin?: string;
  transformStyle?: CSSProperties['transformStyle'];
  transition?: string;
  transitionDelay?: string;
  transitionDuration?: string;
  transitionProperty?: string;
  transitionTimingFunction?: string;
  unicodeBidi?: CSSProperties['unicodeBidi'];
  userSelect?: CSSProperties['userSelect'];
  verticalAlign?: string;
  visibility?: CSSProperties['visibility'];
  whiteSpace?: CSSProperties['whiteSpace'];
  widows?: CSSProperties['widows'];
  // width?: string;
  wordBreak?: CSSProperties['wordBreak'];
  wordSpacing?: string;
  wordWrap?: CSSProperties['wordWrap'];
  writingMode?: CSSProperties['writingMode'];
  zIndex?: CSSProperties['zIndex'];
};

/**
 * Absolute & Relatvie Constraint type for style properties (left, top, right, bottom)
 */
export type Constraint = {
  absolute: number;
  relative: number;
  anchor: boolean;
};

/**
 * Absolute & Relatvie Position type for style properties (x, y)
 */
export type Position = {
  absolute: number;
  relative: number;
  unit: string; // "px" | "%"
};

export const LENGTH_TYPE = {
  UNDIFINED: 'undefined',
  AUTO: 'auto',
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  FILL: 'fill',
} as const;
/**
 * type of Length type
 */
export type LengthType = (typeof LENGTH_TYPE)[keyof typeof LENGTH_TYPE];
/**
 * Absolute & Relatvie Length type for style properties (width, height)
 */
export type Length = Position & {
  type: LengthType;
};

/**
 * Date type (날짜/시간)
 */
export type Date = string;

/**
 * Color type for background
 */
export type Color = string;

/**
 * PageID type for content properties
 */
export type PageID = number | string;

/**
 * Widget이 가지는 Prop의 MetaData 정보에 대한 Key로 사용될 type입니다.
 * number로 설정했을 때에, 헷갈릴 여지가 많아 type으로 정의했습니다.
 */
export type WidgetPropTypeID = number;

/**
 * Widget이 가지는 Prop의 인스턴스 ID입니다.
 * number로 설정했을 때에, 헷갈릴 여지가 많아 type으로 정의했습니다.
 */
export type WidgetPropID = number;

/**
 * Widget이 가지는 Prop
 */
export interface IWidgetProp {
  readonly propTypeId: WidgetPropTypeID;
  readonly propMeta: WidgetPropMetaData;
  value: any;
  parentPropInfo?: IParentPropInfo;
  eventHandler: HandlerID[];
  //   variableDataId?: DataID;
}

/**
 * Element Attr 인터페이스
 */
export interface IWidgetAttr {
  readonly attrTypeId: WidgetPropTypeID;
  readonly attrMeta: WidgetPropMetaData;
  value: any;
  parentPropInfo?: IParentPropInfo;
  eventHandler: HandlerID[];
  //   variableDataId?: DataID;
}

/**
 * Value 인터페이스
 */
export interface IValue {
  value: any;
  parentPropInfo?: IParentPropInfo;
}

/**
 * Element Style 인터페이스
 */
export interface IWidgetAttr {
  value: any;
  parentPropInfo?: IParentPropInfo;
  eventHandler: HandlerID[];
  //   variableDataId?: DataID;
}

/**
 * Prop MetaData 생성을 위한 서버 데이터 형태
 */
export interface PropMetaDataJson {
  id: number;
  name: string;
  dataType: number;
  defaultValue: any;
  displayName: string;
  variableDataId?: number;
  objectTypeMetaId: number | null;
  isList: boolean;
  // propDetail?: any; // VERSION2_TODO: prop detail 정해지면 undefined 지워야함.
}

/**
 * WidgetModel이 가지고 있는 Prop Map 중 한 개의 데이터
 */
export interface IWidgetPropOneData {
  propId: WidgetPropID;
  widgetProp: IWidgetProp;
  variableDataId?: number;
}

/**
 * Prop을 업데이트하기 위해 필요한 최소한의 데이터
 */
export interface IWidgetPropValueData {
  propId: WidgetPropID;
  value: any;
  variableDataId?: number;
}

/**
 * App 오픈시 Prop 파싱을 위한 서버 데이터 형태
 */
export interface PropNodeJson {
  propId: WidgetPropID;

  metadata_id: WidgetPropTypeID; // VERSION2_FIXME: 서버에서 DTO 이름 카멜케이스로 수정 필요
  value: any;
  parentPropInfo: any;
  eventHandler?: number[];
  variableDataId?: number;
}

/**
 * Widget Prop Instance 생성을 위한 정보
 */
export interface IPropInstance {
  propId: WidgetPropID;
  name: string;
  propTypeId: WidgetPropTypeID;
  dataType: number;
  defaultValue: any;
  displayName: string;
  value: any;
  parentPropInfo: string;
  control: PropControlTypes;
  controlInfo?: ControlInfo;
  controlDependency?: ControlDependency;
  controlSubComponentCount?: ControlSubComponentCount;
  eventHandler?: number[];
  variableDataId?: number;
  objectTypeMetaId: number | null;
  isList: boolean;
}

/**
 * section interface 입니다.
 */
export interface PageSection {
  name: string;
  id: number;
  isExpanded: boolean;
  pageCount: number;
  isSelected: boolean;
}
