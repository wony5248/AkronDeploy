import { IWidgetContentProperties, WidgetTypeEnum } from '@akron/runner';

export const commonStyleMeta = {
  frameType: { value: undefined, defaultValue: 'absolute', variableId: -1 },
  left: {
    value: undefined,
    defaultValue: { absolute: 0, relative: 0, unit: 'px', anchor: false },
    variableId: -1,
  },
  top: {
    value: undefined,
    defaultValue: { absolute: 0, relative: 0, unit: 'px', anchor: false },
    variableId: -1,
  },
  right: {
    value: undefined,
    defaultValue: { absolute: 0, relative: 0, unit: 'px', anchor: false },
    variableId: -1,
  },
  bottom: {
    value: undefined,
    defaultValue: { absolute: 0, relative: 0, unit: 'px', anchor: false },
    variableId: -1,
  },
  rotate: { value: undefined, defaultValue: '', variableId: -1 },
  x: { value: undefined, defaultValue: { absolute: 0, relative: 0, unit: 'px' }, variableId: -1 },
  y: { value: undefined, defaultValue: { absolute: 0, relative: 0, unit: 'px' }, variableId: -1 },
  width: { value: undefined, defaultValue: { absolute: 100, relative: 0, unit: 'px' }, variableId: -1 },
  height: { value: undefined, defaultValue: { absolute: 60, relative: 0, unit: 'px' }, variableId: -1 },
  alignContent: { value: undefined, defaultValue: '', variableId: -1 },
  alignItems: { value: undefined, defaultValue: '', variableId: -1 },
  alignSelf: { value: undefined, defaultValue: '', variableId: -1 },
  all: { value: undefined, defaultValue: '', variableId: -1 },
  animation: { value: undefined, defaultValue: '', variableId: -1 },
  animationDelay: { value: undefined, defaultValue: '', variableId: -1 },
  animationDirection: { value: undefined, defaultValue: '', variableId: -1 },
  animationDuration: { value: undefined, defaultValue: '', variableId: -1 },
  animationFillMode: { value: undefined, defaultValue: '', variableId: -1 },
  animationIterationCount: { value: undefined, defaultValue: '', variableId: -1 },
  animationName: { value: undefined, defaultValue: '', variableId: -1 },
  animationPlayState: { value: undefined, defaultValue: '', variableId: -1 },
  animationTimingFunction: { value: undefined, defaultValue: '', variableId: -1 },
  backfaceVisibility: { value: undefined, defaultValue: '', variableId: -1 },
  background: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundAttachment: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundBlendMode: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundClip: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundColor: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundImage: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundOrigin: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundPosition: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundRepeat: { value: undefined, defaultValue: '', variableId: -1 },
  backgroundSize: { value: undefined, defaultValue: '', variableId: -1 },
  border: { value: undefined, defaultValue: '', variableId: -1 },
  borderBottom: { value: undefined, defaultValue: '', variableId: -1 },
  borderBottomLeftRadius: { value: undefined, defaultValue: '', variableId: -1 },
  borderBottomRightRadius: { value: undefined, defaultValue: '', variableId: -1 },
  borderBottomStyle: { value: undefined, defaultValue: '', variableId: -1 },
  borderBottomWidth: { value: undefined, defaultValue: '', variableId: -1 },
  borderCollapse: { value: undefined, defaultValue: '', variableId: -1 },
  borderColor: { value: undefined, defaultValue: '', variableId: -1 },
  borderImage: { value: undefined, defaultValue: '', variableId: -1 },
  borderImageOutset: { value: undefined, defaultValue: '', variableId: -1 },
  borderImageRepeat: { value: undefined, defaultValue: '', variableId: -1 },
  position: { value: undefined, defaultValue: 'absolute', variableId: -1 },
};

export const pageStyleMeta = {
  position: { value: undefined, defaultValue: 'relative', variableId: -1 },
  display: { value: undefined, defaultValue: 'flex', variableId: -1 },
  margin: { value: undefined, defaultValue: 'auto', variableId: -1 },
  transform: { value: undefined, defaultValue: 'scale(1)', variableId: -1 },
  transformOrigin: { value: undefined, defaultValue: '50% 50%', variableId: -1 },
  verticalAlign: { value: undefined, defaultValue: 'top', variableId: -1 },
  textAlign: { value: undefined, defaultValue: 'initial', variableId: -1 },
  boxSizing: { value: undefined, defaultValue: 'border-box', variableId: -1 },
  overflow: { value: undefined, defaultValue: 'visible', variableId: -1 },
  backgroundColor: { value: undefined, defaultValue: '#ffffff', variableId: -1 },
  width: {
    value: undefined,
    defaultValue: { absolute: 430, relative: 0, unit: 'px' },
    variableId: -1,
  },
  height: {
    value: undefined,
    defaultValue: { absolute: 932, relative: 0, unit: 'px' },
    variableId: -1,
  },
};

export const basicButtonContentMeta = {
  className: {
    value: undefined,
    defaultValue: '',
    variableId: -1,
  },
  classes: {
    value: undefined,
    defaultValue: '',
    variableId: -1,
  },
  component: {
    value: undefined,
    defaultValue: '',
    variableId: -1,
  },
  text: {
    value: undefined,
    defaultValue: '',
    variableId: -1,
  },
  color: {
    value: undefined,
    defaultValue: 'primary',
    variableId: -1,
  },
  disabled: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  disableElevation: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  disableFocusRipple: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  disableRipple: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  endIcon: {
    value: undefined,
    defaultValue: undefined,
    variableId: -1,
  },
  sx: {
    value: undefined,
    defaultValue: { ...commonStyleMeta, width: '100px', height: '50px' },
    variableId: -1,
  },
  action: {
    value: undefined,
    defaultValue: undefined,
    variableId: -1,
  },
  LinkComponent: {
    value: undefined,
    defaultValue: undefined,
    variableId: -1,
  },
  fullWidth: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  href: {
    value: undefined,
    defaultValue: '',
    variableId: -1,
  },
  size: {
    value: undefined,
    defaultValue: 'medium',
    variableId: -1,
  },
  startIcon: {
    value: undefined,
    defaultValue: undefined,
    variableId: -1,
  },
  TouchRippleProps: {
    value: undefined,
    defaultValue: undefined,
    variableId: -1,
  },
  touchRippleRef: {
    value: undefined,
    defaultValue: undefined,
    variableId: -1,
  },
  variant: {
    value: undefined,
    defaultValue: 'contained',
    variableId: -1,
  },
  centerRipple: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  disableTouchRipple: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  focusRipple: {
    value: undefined,
    defaultValue: false,
    variableId: -1,
  },
  focusVisibleClassName: {
    value: undefined,
    defaultValue: '',
    variableId: -1,
  },
};

export function getMetaDataByType(widgetType: WidgetTypeEnum): { metaData: IWidgetContentProperties; name: string } {
  let metaData: IWidgetContentProperties = {};
  let name: string = '';
  switch (widgetType) {
    case WidgetTypeEnum.BasicButton: {
      metaData = basicButtonContentMeta;
      name = 'BasicButton';
    }
    default: {
      // 없으면 버튼
      metaData = basicButtonContentMeta;
      name = 'BasicButton';
    }
  }
  return { metaData, name };
}
