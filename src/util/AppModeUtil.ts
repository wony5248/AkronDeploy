import AppModeContainer, { AppModeType } from 'models/store/container/AppModeContainer';

/**
 * 현재 앱 모드가 'EDIT_APP' 모드인지 확인합니다.
 * App type(UX/GX)과 상관없이 앱 모드만 확인합니다.
 * App type에 따라 동작이 다른 경우, isUXEditAppMode 또는 isGXEditAppMode를 호출해야 합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns App type과 상관없이 현재 앱 모드가 'EDIT_APP'인 경우 true
 */
export function isEditAppMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const editAppMode: AppModeType[] = ['EDIT_APP'];

  return editAppMode.includes(currentAppMode);
}

/**
 * 현재 앱 모드가 'EDIT_DIALOG_WIDGET' 모드인지 확인합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns 현재 앱 모드가 'EDIT_DIALOG_WIDGET'인 경우 true
 */
export function isEditDialogWidgetMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const editDialogWidgetMode: AppModeType[] = ['EDIT_DIALOG_WIDGET'];

  return editDialogWidgetMode.includes(currentAppMode);
}

/**
 * 현재 앱 모드가 'PAGE_LIST' 모드인지 확인합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns 현재 앱 모드가 'PAGE_LIST'인 경우 true
 */
export function isPageListMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const pageListMode: AppModeType[] = ['PAGE_LIST'];

  return pageListMode.includes(currentAppMode);
}

/**
 * 현재 앱 모드가 'RUNTIME_PREVIEW' 모드인지 확인합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns 현재 앱 모드가 'RUNTIME_PREVIEW'인 경우 true
 */
export function isRuntimePreviewMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const runtimePreviewMode: AppModeType[] = ['RUNTIME_PREVIEW'];

  return runtimePreviewMode.includes(currentAppMode);
}

/**
 * 현재 앱 모드가 'RUNTIME' 모드인지 확인합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns 현재 앱 모드가 'RUNTIME'인 경우 true
 */
export function isRuntimeMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const runtimeMode: AppModeType[] = ['RUNTIME'];

  return runtimeMode.includes(currentAppMode);
}

/**
 * 현재 앱 모드가 편집 가능한 모드인지 확인합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns 현재 앱 모드가 편집 가능한 모드('EDIT_APP', 'EDIT_DIALOG_WIDGET')인 경우 true
 */
export function isEditableMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const editableMode: AppModeType[] = ['EDIT_APP', 'EDIT_DIALOG_WIDGET'];

  return editableMode.includes(currentAppMode);
}

/**
 * 현재 앱 모드가 Widget 생성/편집을 위한 모드인지 확인합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns 현재 앱 모드가 widget 생성/편집 모드('EDIT_DIALOG_WIDGET')인 경우 true
 */
export function isEditWidgetMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const ediWidgetMode: AppModeType[] = ['EDIT_DIALOG_WIDGET'];

  return ediWidgetMode.includes(currentAppMode);
}

/**
 * 현재 앱 모드가 Runtime 기반 모드인지 확인합니다.
 *
 * @param appModeContainer AppModeContainer
 * @returns 현재 앱 모드가 runtime 관련 모드('RUNTIME_PREVIEW', 'RUNTIME')인 경우 true
 */
export function isRuntimeBasedMode(appModeContainer: AppModeContainer): boolean {
  const currentAppMode = appModeContainer.getAppMode();

  const rumtimeBasedMode: AppModeType[] = ['RUNTIME_PREVIEW', 'RUNTIME'];

  return rumtimeBasedMode.includes(currentAppMode);
}
