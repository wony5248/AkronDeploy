import { WidgetID } from 'models/node/WidgetModel';
import { WidgetPropID } from 'models/widget/WidgetPropTypes';
import CompositeModel from 'store/component/CompositeModel';

/**
 * Widget Custom Prop
 */
export interface ICustomProp {
  name: string;
  dataTypeId: number;
  value: any;
  description: string;
  objectTypeMetaId: number | null;
  isList: boolean;
}

/**
 * Widget Custom PropMeessage
 */
export interface ICustomPropMessage {
  id: number;
  name: string;
  dataType: number;
  value: any;
  componentTypeId: number;
  objectTypeMetaId: number | null;
  isList: boolean;
}

/**
 * Composite Model 정보
 */
export interface ICompositeModel {
  name: string;
  props?: CustomProps;
  locked?: boolean;
  hidden?: boolean;
}

/**
 * 커스텀 프로퍼티 맵
 * key: propID, value: propValue
 */
export type CustomProps = Map<WidgetPropID, ICustomProp>;

/**
 * Composite Model 맵
 * key: 최상단 widgetID, value: composite model info
 */
export type CompositeModels = Map<WidgetID, CompositeModel>;

/**
 * Custom Props 맵 타입
 * key: 최상단 widgetID, value: custom props info
 */
export type CompositeWidgetCustomProps = Map<WidgetID, CustomProps>;

/**
 * Composite Component Model OUT DTO
 */
export interface ICompositeModelDTO {
  componentId: number;
  name: string;
  locked: boolean;
  hidden: boolean;
}

/**
 * Composite Widget Props OUT DTO
 */
export interface ICompositePropsDTO {
  propId: number;
  componentId: number;
  name: string;
  dataTypeId: number;
  value: string;
  description: string;
  objectTypeMetaId: number | null;
  isList: boolean;
}

/**
 * Composite Component DTO Object
 */
export interface ICompositeComponentDTO {
  compositeProps: Array<ICompositePropsDTO>;
  compositeModels: Array<ICompositeModelDTO>;
}
