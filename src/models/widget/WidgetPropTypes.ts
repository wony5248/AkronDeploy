import WidgetModel, { WidgetID, WidgetTypeID } from 'models/node/WidgetModel';

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
  /* eslint-disable camelcase */
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
