// component 관련 propsHandler

import { AppStore, Nullable, WidgetTypeEnum } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import EditorStore from 'models/store/EditorStore';
import { RibbonProp } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import { checkWidgetType, isWidgetsCopyable, isWidgetsDeletable } from 'util/WidgetUtil';

/**
 * 자식을 가질 수 있는 것들의 모음.
 */
export const basicChildableWidgetTypeNames: Array<string> = [
  // INPUTS
  'BasicIconButton',
  'BasicButtonGroup',
  'BasicFloatingActionButton',
  'BasicRadioGroup',
  'BasicNativeSelect',
  'BasicSelect',
  'BasicToggleButton',
  'BasicToggleButtonGroup',
  // ...
  // DATA DISPLAY
  'BasicAvatar',
  'BasicAvatarGroup',
  'BasicBadge',
  'BasicDivider',
  'BasicList',
  'BasicListItem',
  'BasicListItemAvatar',
  'BasicListItemButton',
  'BasicListItemIcon',
  'BasicListItemSecondaryAction',
  'BasicListItemText',
  'BasicListSubheader',
  'BasicTable',
  'BasicTableBody',
  'BasicTableCell',
  'BasicTableContainer',
  'BasicTableFooter',
  'BasicTableHead',
  'BasicTableRow',
  'BasicTableSortLabel',
  'BasicTooltip',
  // ...
  // FEEDBACK
  'BasicAlert',
  'BasicAlertTitle',
  'BasicBackdrop',
  'BasicDialog',
  'BasicDialogActions',
  'BasicDialogContent',
  'BasicDialogTitle',
  'BasicSnackbar',
  'BasicSkeleton',
  // SURFACES
  'BasicPaper',
  'BasicAccordion',
  'BasicAccordionActions',
  'BasicAccordionDetails',
  'BasicAccordionSummary',
  'BasicAppBar',
  'BasicToolbar',
  'BasicCard',
  'BasicCardActionArea',
  'BasicCardActions',
  'BasicCardContent',
  // ...
  // NAVIGATION
  'BasicBottomNavigation',
  'BasicBreadcrumbs',
  'BasicDrawer',
  'BasicSwipeableDrawer',
  'BasicClickAwayListener',
  'BasicMenu',
  'BasicMenuItem',
  'BasicMenuList',
  'BasicPopover',
  'BasicPopper',
  'BasicSpeedDial',
  'BasicStep',
  'BasicStepButton',
  'BasicStepContent',
  'BasicStepLabel',
  'BasicStepper',
  'BasicTabContext',
  'BasicTabList',
  'BasicTabPanel',
  'BasicTabScrollButton',
  'BasicTabs',
  // LAYOUT
  'BasicBox',
  'BasicContainer',
  'BasicGrid',
  'BasicStack',
  'BasicImageList',
  'BasicImageListItem',
  // DATE & TIME PICKER
];

export const basicChildableWidgetTypeNamesSet = new Set(basicChildableWidgetTypeNames);

/**
 * 특정 Component의 자식밖에 될 수 없는 컴포넌트들의 모음.
 */
export const basicChildWidgetTypeNames: Array<string> = [
  // basic
  'BasicOption',
  // INPUTS
  // DATA DISPLAY
  'BasicListItem',
  'BasicListItemAvatar',
  'BasicListItemButton',
  'BasicListItemIcon',
  'BasicListItemSecondaryAction',
  'BasicListItemText',
  'BasicListSubheader',
  // 'BasicTable',
  'BasicTableHead',
  'BasicTableBody',
  'BasicTableFooter',
  'BasicTableRow',
  'BasicTableCell',
  'BasicTableSortLabel',
  // FEEDBACK
  'BasicAlertTitle',
  'BasicDialogActions',
  'BasicDialogContent',
  'BasicDialogContentText',
  'BasicDialogTitle',
  // SURFACES
  'BasicAccordionActions',
  'BasicAccordionDetails',
  'BasicAccordionSummary',
  'BasicToolbar',
  'BasicCardActionArea',
  'BasicCardActions',
  'BasicCardContent',
  'BasicCardHeader',
  'BasicCardMedia',
  // NAVIGATION
  'BasicBottomNavigationAction',
  // 'BasicMenuItem',
  'BasicSpeedDialAction',
  'BasicStep',
  'BasicStepButton',
  'BasicStepConnector',
  'BasicStepContent',
  'BasicStepIcon',
  'BasicStepLabel',
  'BasicTab',
  'BasicTabList',
  'BasicTabPanel',
  // LAYOUT
  'BasicImageListItem',
  'BasicImageListItemBar',
];

export const basicChildWidgetTypeNamesSet = new Set(basicChildWidgetTypeNames);

/**
 * 컴포넌트 삭제 버튼에 대한 disable 처리
 */
export function deleteComponentDisabledPropsHandler(appStore: EditorStore): RibbonProp {
  const selectedWidgets = appStore.getSelectedWidgets();
  return {
    disabled: !isWidgetsDeletable(selectedWidgets),
  };
}

export const parentChildEssentialRelationMap = new Map<(typeof basicChildableWidgetTypeNames)[number], Set<string>>([
  // TODO: 향후 내부 들어갈 수 있는 관계 파악 후 일괄 적용 필요
  // INPUTS
  ['BasicIconButton', new Set(['BasicIcon', 'BasicBadge'])], // Icon, Badge 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicButtonGroup', new Set(['BasicButton', 'BasicLoadingButton', 'BasicIconButton'])], // Button, LoadingButton 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicFloatingActionButton', new Set(['BasicIcon', 'BasicLabel'])], // BasicFloatingActionButton 하위에만 들어갈 수 있는 컴포넌트들
  ['BasicRadioGroup', new Set(['BasicRadio'])], // Radio 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicNativeSelect', new Set(['BasicOption'])], // Option 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicSelect', new Set(['BasicMenuItem'])], // MenuItem 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicToggleButtonGroup', new Set(['BasicToggleButton'])], // ToggleButton 추가 버튼 제외한 나머지 버튼 비활성화
  // DATA DISPLAY
  ['BasicAvatarGroup', new Set(['BasicAvatar'])], // Avatar 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicBadge', new Set(['BasicIcon'])], // BasicBadge 하위에 들어갈 수 있는 컴포넌트들
  [
    'BasicList',
    new Set([
      'BasicListItem',
      'BasicListItemAvatar',
      'BasicListItemButton',
      'BasicListItemIcon',
      'BasicListItemSecondaryAction',
      'BasicListItemText',
      'BasicListSubheader',
      'BasicDivider',
    ]),
  ], // BasicList 하위에만 들어갈 수 있는 컴포넌트들
  [
    'BasicListItem',
    new Set([
      'BasicListItemAvatar',
      'BasicListItemButton',
      'BasicListItemIcon',
      'BasicListItemSecondaryAction',
      'BasicListItemText',
    ]),
  ], // BasicListItem 하위에만 들어갈 수 있는 컴포넌트들
  ['BasicListItemButton', new Set(['BasicListItemText', 'BasicListItemIcon'])], // BasicListItemButton 하위에만 들어갈 수 있는 컴포넌트들
  ['BasicListItemAvatar', new Set(['BasicAvatar'])], // Avatar 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicListItemIcon', new Set(['BasicIcon'])], // Icon 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicTableContainer', new Set(['BasicTable'])], // BasicTable 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicTable', new Set(['BasicTableHead', 'BasicTableBody', 'BasicTableFooter'])], // BasicTable 하위에만 들어갈 수 있는 컴포넌트들
  ['BasicTableHead', new Set(['BasicTableRow'])], // BasicTableRow 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicTableBody', new Set(['BasicTableRow'])], // BasicTableRow 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicTableFooter', new Set(['BasicTableRow'])], // BasicTableRow 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicTableRow', new Set(['BasicTableCell'])], // BasicTableCell 추가 버튼 제외한 나머지 버튼 비활성화
  [
    'BasicTableCell',
    new Set([
      'BasicTableSortLabel',
      'BasicCheckbox',
      'BasicLabel',
      'BasicButton',
      'BasicTextField',
      'BasicSwitch',
      'BasicIconButton',
    ]),
  ], // BasicTableCell 하위에만 들어갈 수 있는 컴포넌트들
  // FEEDBACK
  ['BasicAlert', new Set(['BasicAlertTitle'])], // BasicAlertTitle 추가 버튼 제외한 나머지 버튼 비활성화
  // SERFACES
  ['BasicAccordion', new Set(['BasicAccordionSummary', 'BasicAccordionDetails', 'BasicAccordionActions'])], // BasicAccordion 하위에 들어갈 수 있는 컴포넌트들
  ['BasicAppBar', new Set(['BasicToolbar'])], // BasicAppBar 하위에 들어갈 수 있는 컴포넌트들
  [
    'BasicCard',
    new Set(['BasicCardActionArea', 'BasicCardActions', 'BasicCardContent', 'BasicCardHeader', 'BasicCardMedia']),
  ], // BasicCard 하위에 들어갈 수 있는 컴포넌트들
  ['BasicCardActionArea', new Set(['BasicCardContent', 'BasicCardMedia'])], // BasicCardActionArea 하위에 들어갈 수 있는 컴포넌트들
  // NAVIGATION
  ['BasicBottomNavigation', new Set(['BasicBottomNavigationAction'])], // BasicBottomNavigationAction 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicMenu', new Set(['BasicMenuItem'])], // MenuItem 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicMenuList', new Set(['BasicMenuItem'])], // MenuItem 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicSpeedDial', new Set(['BasicSpeedDialAction'])], // BasicSpeedDialAction 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicPagination', new Set(['BasicPaginationItem'])], // BasicPagination 하위에 들어갈 수 있는 컴포넌트들
  [
    'BasicStep',
    new Set(['BasicStepButton', 'BasicStepConnector', 'BasicStepContent', 'BasicStepIcon', 'BasicStepLabel']),
  ], // BasicStep 하위에 들어갈 수 있는 컴포넌트들
  ['BasicStepper', new Set(['BasicStep'])], // BasicStep 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicTabContext', new Set(['BasicTabPanel', 'BasicTabs'])], // TabContext 내부에서 사용할 TabPanel, Tabs를 제외한 나머지 버튼 비활성화
  ['BasicTabs', new Set(['BasicTab'])], // Tab 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicTabList', new Set(['BasicTab'])], // Tab 추가 버튼 제외한 나머지 버튼 비활성화
  // LAYOUT
  ['BasicImageList', new Set(['BasicImageListItem'])], // BasicImageListItem 추가 버튼 제외한 나머지 버튼 비활성화
  ['BasicImageListItem', new Set(['BasicImageListItemBar', 'BasicImage'])], // BasicImageListItem 하위에 들어갈 수 있는 컴포넌트들
]);

export const parentChildPermittedRelationMap = new Map<(typeof basicChildableWidgetTypeNames)[number], Set<string>>([
  // Special
  ['BusinessDialog', new Set(['BasicDialogActions', 'BasicDialogContent', 'BasicDialogTitle'])], // BasicImageListItem 하위에 들어갈 수 있는 컴포넌트들
  ['BasicDialogContent', new Set(['BasicDialogContentText'])],
  ['BasicTabContext', new Set(['BasicTabList'])],
  [
    'BasicMenuItem',
    new Set([
      'BasicListItemAvatar',
      'BasicListItemButton',
      'BasicListItemIcon',
      'BasicListItemSecondaryAction',
      'BasicListItemText',
    ]),
  ],
]);

/**
 * 컴포넌트 추가 버튼에 대한 disable 처리
 */
export function insertComponentDisabledPropsHandler(appStore: EditorStore, commandPropName?: string) {
  const selectedWidgets = appStore.getSelectedWidgets();
  let disabled = false;
  if (selectedWidgets.length === 1 && commandPropName) {
    const widgetType = selectedWidgets[0].getWidgetType();
    // TODO: RepeatableLayout 삽입 가능한 경우에 대한 고려 필요
    if (parentChildEssentialRelationMap.has(widgetType)) {
      disabled = !parentChildEssentialRelationMap.get(widgetType)?.has(commandPropName as string);
    } else {
      // 특정 Component의 자식밖에 될 수 없는 컴포넌트들
      disabled = basicChildWidgetTypeNamesSet.has(commandPropName as string);
      if (
        parentChildPermittedRelationMap.has(widgetType) &&
        parentChildPermittedRelationMap.get(widgetType)?.has(commandPropName as string)
      ) {
        disabled = false;
      }
    }
  }

  return {
    disabled,
  };
}

/**
 * Ribbon의 컴포넌트 추가 버튼에 대한 disable 처리
 */
export function insertRibbonButtonDisabledPropsHandler(appStore: EditorStore) {
  return {
    disabled: appStore.getEditingPageModel()?.getProperties().content.disabled.value,
  };
}

/**
 * Home - Undo 버튼에 대한 disable 처리
 */
export function undoComponentDisabledPropsHandler(appStore: EditorStore): RibbonProp {
  let canUndo = false;
  // canUndo = appStore.getEditModeUndoStack().canUndo();
  //   const appModeContainer = appStore.getAppModeContainer();
  //   if (isEditAppMode(appModeContainer)) {
  //     canUndo = appStore.getEditModeUndoStack().canUndo();
  //   } else if (isEditDialogWidgetMode(appModeContainer)) {
  //     canUndo = appStore.getEditBusinessDialogWidgetModeUndoStack().canUndo();
  //   }

  return {
    disabled: !canUndo,
  };
}

/**
 * Home - Redo 버튼에 대한 disable 처리
 */
export function redoComponentDisabledPropsHandler(appStore: EditorStore): RibbonProp {
  let canRedo = false;
  // canRedo = appStore.getEditModeUndoStack().canRedo();
  const appModeContainer = appStore.getCtx().getAppModeContainer();
  //   if (isEditAppMode(appModeContainer)) {
  //     canRedo = appStore.getEditModeUndoStack().canRedo();
  //   } else if (isEditDialogWidgetMode(appModeContainer)) {
  //     canRedo = appStore.getEditBusinessDialogWidgetModeUndoStack().canRedo();
  //   }
  return {
    disabled: !canRedo,
  };
}

/**
 * 사용자 지정 - 옵션 버튼에 대한 disable 처리
 */
export function optionComponentDisabledPropsHandler(appStore: EditorStore): RibbonProp {
  let optionDisable = true;

  const appModeContainer = appStore.getCtx().getAppModeContainer();
  const selectedWidgets = appStore.getSelectedWidgets();
  if (
    selectedWidgets.length === 1 &&
    selectedWidgets[0].getWidgetType() === WidgetTypeEnum.BasicDialog &&
    selectedWidgets[0].getProperties().content.locked.value === false
  ) {
    optionDisable = false;
  }
  //   if (isEditWidgetMode(appModeContainer)) {
  //     const selectedWidgets = appStore.getSelectedWidgets();
  //     if (
  //       selectedWidgets.length === 1 &&
  //       selectedWidgets[0].getWidgetType() === 'BusinessDialog' &&
  //       selectedWidgets[0].getComponentSpecificProperties().locked === false
  //     ) {
  //       optionDisable = false;
  //     }
  //   }
  return {
    disabled: optionDisable,
  };
}

/**
 * WidgetModel의 복사가 가능한지 체크.
 */
export function copyResourcePropsHandler(appStore: EditorStore): RibbonProp {
  return {
    disabled: !isWidgetsCopyable(appStore.getSelectedWidgets()),
  };
}

/**
 * widget layer 이동이 위로 가능한지 체크.
 */
export function moveUpPropsHandler(appStore: EditorStore): RibbonProp {
  const selectedWidget = appStore.getSelectedWidgets()[0];

  const disabled =
    !selectedWidget || !selectedWidget.getNextSibling() || selectedWidget.getProperties().content.locked.value;

  return {
    disabled,
  };
}

/**
 * widget layer 이동이 아래로 가능한지 체크.
 */
export function moveDownPropsHandler(appStore: EditorStore): RibbonProp {
  const selectedWidget = appStore.getSelectedWidgets()[0];
  const firstChild = selectedWidget.getParent()?.getFirstChild();

  const disabled =
    !selectedWidget ||
    !firstChild ||
    selectedWidget.getID() === firstChild.getID() ||
    selectedWidget.getProperties().content.locked.value;
  // checkWidgetType(selectedWidget, 'FragmentLayout');

  return {
    disabled,
  };
}

/**
 * 해당 WidgetModel의 부모가 Locked인지 확인하는 재귀 함수
 * widgetModels이 최상위 부모인 PageModel이 될 때까지 Locked 속성 확인 후 맞다면 true / 아닐 경우 false 반환
 */
export function checkToParentLockedIs(widgetModel: Nullable<WidgetModel>): boolean {
  if (widgetModel?.getProperties().content.locked.value) {
    return true;
  }
  //   if (checkBusinessOrPageDialogModel(widgetModel)) return false;
  return checkToParentLockedIs(widgetModel?.getParent());
}

// /**
//  * widget의 부모가 lock 인지 체크.
//  */
// export function lockResourcePropsHandler(appStore: EditorStore): ribbonProp {
//   const selectedWidget = appStore.getSelectedWidgets()[0];
//   const disabled = !checkBusinessOrPageDialogModel(selectedWidget) && checkToParentLockedIs(selectedWidget.getParent());
//   return { disabled };
// }
