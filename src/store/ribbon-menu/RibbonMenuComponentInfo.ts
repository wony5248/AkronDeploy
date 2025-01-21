// import AppStore from 'common/store/app/AppStore';
// import { isUndefined } from 'office-core';
// import BuildAppDialogContentComponent from 'ux/component/ribbon/dialogContent/BuildAppDialogContentComponent';
// import BusinessDialogListContentComponent from 'ux/component/ribbon/dialogContent/BusinessDialogListContentComponent';
// import CloseBusinessDialogEditModeContentComponent from 'ux/component/ribbon/dialogContent/CloseBusinessDialogEditModeContentComponent';
// import CompositeComponentCustomPropsStatesDialogContentComponent from 'ux/component/ribbon/dialogContent/CompositeComponentCustomPropsStatesDialogContentComponent';
// import FileImportDialogContentComponent from 'ux/component/ribbon/dialogContent/FileImportDialogContentComponent';
// import FileListDialogContentComponent from 'ux/component/ribbon/dialogContent/FileListDialogContentComponent';
// // import InsertOnlineMediaDialogContentComponent from 'ux/component/ribbon/dialogContent/InsertOnlineMediaDialogContentComponent';
// import RegisterBusinessDialogComponentDialogContentComponent from 'ux/component/ribbon/dialogContent/RegisterBusinessDialogComponentDialogContentComponent';
// import RenameSectionDialogContentComponent from 'ux/component/ribbon/dialogContent/RenameSectionDialogContentComponent';
// import RibbonNewAppDialogComponent from 'ux/component/ribbon/dialogContent/RibbonNewAppDialogComponent';
// import RibbonUpdateNameDialogComponent from 'ux/component/ribbon/dialogContent/RibbonUpdateNameDialogComponent';
// import SaveAsDialogContentComponent from 'ux/component/ribbon/dialogContent/SaveAsDialogContentComponent';
// import SelectReactNodePropContentComponent from 'ux/component/ribbon/dialogContent/SelectReactNodePropContentComponent';
// import UpdatePageLevelDialogContentComponent from 'ux/component/ribbon/dialogContent/UpdatePageLevelDialogContentComponent';
// import VariableDataStoreDialogContentComponent from 'ux/component/ribbon/dialogContent/VariableDataStoreDialogContentComponent';
// import ZoomInOutDialogContentComponent from 'ux/component/ribbon/dialogContent/ZoomInOutDialogContentComponent';
// import DefaultGalleryItemComponent from 'ux/component/ribbon/galleryContent/DefaultGalleryItemComponent';
// import RenamePageDialogContentComponent from 'ux/component/ribbon/dialogContent/RenamePageDialogContentComponent';
// import {
//     undoComponentDisabledPropsHandler,
//     redoComponentDisabledPropsHandler,
//     insertComponentDisabledPropsHandler,
//     insertRibbonButtonDisabledPropsHandler,
//     deleteComponentDisabledPropsHandler,
//     uxComponentDropdownPropsHandler,
//     templateComponentAddNewComponentPropsHandler,
//     optionComponentDisabledPropsHandler,
//     moveUpPropsHandler,
//     moveDownPropsHandler,
//     copyResourcePropsHandler,
//     lockResourcePropsHandler,
// } from 'ux/component/ribbon/handler/componentPropsHandler';
// import { dataStorePropsHandler, viewProjectPropsHandler } from 'ux/component/ribbon/handler/modePropsHandler';
// import {
//     pageLockSelectedPropsHandler,
//     pageHideSelectedPropsHandler,
//     pageLockDisabledPropsHandler,
//     pageDeleteDisabledPropsHandler,
// } from 'ux/component/ribbon/handler/pagePropsHandler';
// import {
//     sectionDropdownPropsHandler,
//     sectionAddSectionPropsHandler,
//     sectionDeletePropsHandler,
//     sectionExistPropsHandler,
// } from 'ux/component/ribbon/handler/sectionPropsHandler';
// import { serviceMappingPropsHandler } from 'ux/component/ribbon/handler/serviceProsphandler';
// import DialogMenuItemComponent from 'ux/component/ribbon/menuItem/DialogMenuItemComponent';
// import DialogNoImageMenuItemComponent from 'ux/component/ribbon/menuItem/DialogNoImageMenuItemComponent';
// import GalleryMenuItemComponent from 'ux/component/ribbon/menuItem/GalleryMenuItemComponent';
// import GreyTextAreaMenuItemComponent from 'ux/component/ribbon/menuItem/GreyTextAreaMenuItemComponent';
// import IconMenuItemComponent from 'ux/component/ribbon/menuItem/IconMenuItemComponent';
// import NormalMenuItemComponent from 'ux/component/ribbon/menuItem/NormalMenuItemComponent';
// import SeparatorItemComponent from 'ux/component/ribbon/menuItem/SeparatorItemComponent';
// import SubMenuItemComponent from 'ux/component/ribbon/menuItem/SubMenuItemComponent';
// import sectionSelectedPropsHandler from 'ux/component/toolpane/handler/toolPaneSectionPropsHandler';
// import NudgeAmountControlDialogComponent from 'ux/component/widget-editor/widget/NudgeAmountControlDialogComponent';
// import UpdateDeviceDialogContentComponent from 'ux/component/ribbon/dialogContent/UpdateDeviceDialogContentComponent';
// import RenameResourceDialogContentComponent from 'ux/component/ribbon/dialogContent/RenameResourceDialogContentComponent';
// import PublishGXComponentsDialogContentComponent from 'gx/component/ribbon/dialogContent/PublishGXComponentsDialogContentComponent';
// import PublishUXComponentsDialogContentComponent from 'gx/component/ribbon/dialogContent/PublishUXComponentsDialogContentComponent';
// import RibbonOpenFileDialogContentComponent from 'ux/component/ribbon/dialogContent/OpenFileDialogComponent';
// import {
//     businessDialogClosePropsHandler,
//     businessDialogListPropsHandler,
//     businessDialogRegisterPropsHandler,
// } from 'ux/component/ribbon/handler/businessDialogPropsHandler';
// import GXCustomComponentDialogComponent from 'ux/component/workarea/GXCustomComponentDialogComponent';
// import DxServiceInfoDialogComponent from 'ux/component/workarea/DxServiceInfoDialogComponent';
// import PublishUXTemplateDialogContentComponent from 'gx/component/ribbon/dialogContent/PublishUXTemplateDialogContentComponent';
// import SelectUXComponentLibraryDialogComponent from 'ux/component/workarea/SelectUXComponentLibraryDialogComponent';
// import SelectTemplateLibraryDialogComponent from 'ux/component/workarea/SelectTemplateLibraryDialogComponent';

import EditorStore from 'models/store/EditorStore';
import BuildAppDialogContentComponent from 'store/ribbon-menu/dialog-content/BuildAppDialogContentComponent';
import UpdateDeviceDialogContentComponent from 'store/ribbon-menu/dialog-content/UpdateDeviceDialogContentComponent';

/**
 * toolPaneTabMap 자료 구조 때문에 이관
 * Naming 변경 필요
 */
export interface IRibbonTab {
  // 탭의 이름.
  label: string;
  // id of tab
  id: string;
  // Normal or Contextual
  type: 'Normal' | 'Contextual';
  // Show for Contextual
  show?: boolean;
  // 탭에 해당하는 control 그룹들.
  groups: readonly IRibbonGroupProp[];
}

/**
 * toolPaneTabMap 자료 구조 때문에 이관
 * Naming 변경 필요
 */
export interface IRibbonGroupProp {
  id: string;
  label: string;
  type: string;
  image: string;
  tooltip?: string;
  childList: IRibbonItemProp[];
}

/**
 * RibbonButton 정보
 */
export interface IRibbonButton {
  label: string;
  image: string;
  commandType?: string;
  commandPropName?: string;
  type?: 'dialog' | 'dropdown';
  tooltip?: string;
  childList?: IRibbonItemProp[];
}

/**
 * getPropsHandler를 사용하기 위한 필수 item 정보
 */
export interface PropHandlerItem {
  id: string;
  commandPropName?: string;
}

/**
 * RibbonMenu 내 Item들의 정보
 */
export interface IRibbonItemProp extends PropHandlerItem {
  id: string;
  label?: string;
  greyLabel?: string;
  type: string;
  commandType?: string;
  commandPropName?: string;
  image?: string;
  childList?: IRibbonItemProp[];
  tooltip?: string;
  disabled?: boolean;
  selected?: boolean;
}

/**
 * dropdown MenuItem을 위한 map
 */
type DropdownMenuItemType = string;
// | typeof NormalMenuItemComponent
// | typeof SubMenuItemComponent
// | typeof GalleryMenuItemComponent
// | typeof SeparatorItemComponent
// | typeof DialogMenuItemComponent
// | typeof IconMenuItemComponent
// | typeof GreyTextAreaMenuItemComponent
// | typeof DialogNoImageMenuItemComponent;

export const ribbonDropdownMenuItemMap: { [key: string]: DropdownMenuItemType } = {
  // Ribbon Resize 되었을 때, 상위 Button 류를 처리하기 위함
  // NormalButton: NormalMenuItemComponent,
  // DropdownButton: SubMenuItemComponent,
  // DialogButton: DialogMenuItemComponent,
  // // Dropdown 내부에 위치하는 MenuItem
  // NormalMenuItem: NormalMenuItemComponent,
  // SubMenuItem: SubMenuItemComponent,
  // GalleryMenuItem: GalleryMenuItemComponent,
  // SeparatorItem: SeparatorItemComponent,
  // DialogMenuItem: DialogMenuItemComponent,
  // IconMenuItem: IconMenuItemComponent,
  // GreyLebelMenuItem: GreyTextAreaMenuItemComponent,
  // DialogMenuItemWithNoImage: DialogNoImageMenuItemComponent,
};

/**
 * dialog content를 위한 map
 */
export type DialogContentType =
  // | typeof PublishGXComponentsDialogContentComponent
  // | typeof PublishUXComponentsDialogContentComponent
  // | typeof PublishUXTemplateDialogContentComponent
  // // | typeof InsertOnlineMediaDialogContentComponent
  // | typeof RenamePageDialogContentComponent
  // | typeof RenameSectionDialogContentComponent
  // | typeof SaveAsDialogContentComponent
  // | typeof RenameResourceDialogContentComponent
  // | typeof ZoomInOutDialogContentComponent
  // | typeof VariableDataStoreDialogContentComponent
  // | typeof CompositeComponentCustomPropsStatesDialogContentComponent
  // | typeof CloseBusinessDialogEditModeContentComponent
  // | typeof BusinessDialogListContentComponent
  // | typeof RegisterBusinessDialogComponentDialogContentComponent
  // | typeof SelectReactNodePropContentComponent
  // | typeof UpdatePageLevelDialogContentComponent
  // | typeof NudgeAmountControlDialogComponent
  typeof BuildAppDialogContentComponent | typeof UpdateDeviceDialogContentComponent;
// | typeof GXCustomComponentDialogComponent
// | typeof SelectUXComponentLibraryDialogComponent
// | typeof SelectTemplateLibraryDialogComponent;

export const ribbonDialogContentMap: { [key: string]: DialogContentType } = {
  // PublishGXComponent: PublishGXComponentsDialogContentComponent,
  // PublishUXComponent: PublishUXComponentsDialogContentComponent,
  // PublishUXTemplate: PublishUXTemplateDialogContentComponent,
  // RenamePage: RenamePageDialogContentComponent,
  // // InsertOnlineMedia: InsertOnlineMediaDialogContentComponent,
  // RenameSection: RenameSectionDialogContentComponent,
  // SaveFileAs: SaveAsDialogContentComponent,
  // RenameFile: RibbonUpdateNameDialogComponent,
  // RenameResource: RenameResourceDialogContentComponent,
  // AddFile: RibbonNewAppDialogComponent,
  // OpenFile: RibbonOpenFileDialogContentComponent,
  // ZoomDialog: ZoomInOutDialogContentComponent,
  // CustomPropsStatesDialog: CompositeComponentCustomPropsStatesDialogContentComponent,
  // VariableDataStoreDialog: VariableDataStoreDialogContentComponent,
  // RegisterBusinessDialogComponent: RegisterBusinessDialogComponentDialogContentComponent,
  // CloseBusinessDialogEditMode: CloseBusinessDialogEditModeContentComponent,
  // businessDialogListDialog: BusinessDialogListContentComponent,
  // SelectReactNodeProp: SelectReactNodePropContentComponent,
  // fileImportDialog: FileImportDialogContentComponent,
  // fileListDialog: FileListDialogContentComponent,
  BuildApp: BuildAppDialogContentComponent,
  // UpdatePageLevel: UpdatePageLevelDialogContentComponent,
  // NudgeAmountDialog: NudgeAmountControlDialogComponent,
  UpdateDevice: UpdateDeviceDialogContentComponent,
  // CustomComponent: GXCustomComponentDialogComponent,
  // DxServiceInfoDialog: DxServiceInfoDialogComponent,
  // SelectUXComponent: SelectUXComponentLibraryDialogComponent,
  // SelectTemplate: SelectTemplateLibraryDialogComponent,
};

/**
 * GalleryItem Content를 위한 map
 */
type RibbonGalleryItemContentType = string; // typeof DefaultGalleryItemComponent;

export const ribbonGalleryItemContentMap: { [key: string]: RibbonGalleryItemContentType } = {
  // Default: DefaultGalleryItemComponent,
};

/**
 * PropHandler의 반환 타입 정의
 */
export interface RibbonProp {
  disabled?: boolean;
  selected?: boolean;
}

/**
 * ribbonPropsHandler 타입 정의
 */
type RibbonPropsHandlerType = (editorStore: EditorStore, commandPropName?: string) => RibbonProp;

/**
 * ribbonPropsHandler Map 정의
 * key: RibbonData.ts 내에 명시된 Item 의 ID
 * value: propsHandler
 */
const ribbonPropsHandlerMap: { [key: string]: RibbonPropsHandlerType } = {
  // Home
  // RIB_HOME_UNDO: undoComponentDisabledPropsHandler, // 실행 취소
  // RIB_HOME_REDO: redoComponentDisabledPropsHandler, // 다시 실행
  // RIB_HOME_LOCK_PAGE: pageLockSelectedPropsHandler, // 페이지 잠금
  // RIB_HOME_HIDE_PAGE: pageHideSelectedPropsHandler, // 페이지 숨김
  // RIB_HOME_VARIABLE_DATA: dataStorePropsHandler, // 변수 데이터
  // RIB_HOME_SERVICE_MAPPING: serviceMappingPropsHandler, // 서비스 매핑
  // // Insert
  // RIB_PAGE_DELETE_PAGE: pageDeleteDisabledPropsHandler, // 페이지 삭제
  // RIB_PAGE_PAGE_PROPERTY: pageLockDisabledPropsHandler, // 페이지 속성
  // TOOLPANE_PAGE_CHANGE_NAME: pageLockDisabledPropsHandler,
  // TOOLPANE_PAGE_UPDATE_LEVEL: pageLockDisabledPropsHandler,
  // TOOLPANE_PAGE_DELETE_PAGE: pageDeleteDisabledPropsHandler,
  // RIB_PAGE_SECTION_DROPDOWN: sectionDropdownPropsHandler, // 구역
  // RIB_PAGE_SECTION_ADD_SECTION: sectionAddSectionPropsHandler, // 구역 추가 (구역)
  // RIB_PAGE_SECTION_RENAME_SECTION: sectionSelectedPropsHandler, // 구역 이름 바꾸기 (구역)
  // RIB_PAGE_SECTION_DELETE_SECTION: sectionDeletePropsHandler, // 구역 제거 (구역)
  // RIB_PAGE_SECTION_DELETE_ALL_SECTION: sectionExistPropsHandler, // 모든 구역 제거 (구역)
  // RIB_PAGE_SECTION_SHRINK_ALL_SECTION: sectionExistPropsHandler, // 모두 축소 (구역)
  // RIB_PAGE_SECTION_EXPAND_ALL_SECTION: sectionExistPropsHandler, // 모두 확장 (구역)
  // RIB_INSERT_COMPONENT_LAYOUT_DROPDOWN: insertComponentDisabledPropsHandler, // Layout (Dropdown)
  // // WAPL (Dropdown) RIB_INSERT_COMPONENT_MUI_TMP_DROPDOWN
  // // INPUTS
  // RIB_INSERT_COMPONENT_BASIC_AUTOCOMPLETE: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_BUTTON: insertComponentDisabledPropsHandler, // Button
  // RIB_INSERT_COMPONENT_BASIC_ICON_BUTTON: insertComponentDisabledPropsHandler, // IconButton
  // RIB_INSERT_COMPONENT_BASIC_LOADING_BUTTON: insertComponentDisabledPropsHandler, // LoadingButton
  // RIB_INSERT_COMPONENT_BASIC_BUTTON_GROUP: insertComponentDisabledPropsHandler, // ButtonGroup
  // RIB_INSERT_COMPONENT_BASIC_CHECKBOX: insertComponentDisabledPropsHandler, // Checkbox
  // RIB_INSERT_COMPONENT_BASIC_FLOATING_ACTION_BUTTON: insertComponentDisabledPropsHandler, // FloatingActionButton
  // RIB_INSERT_COMPONENT_BASIC_RADIO: insertComponentDisabledPropsHandler, // Radio
  // RIB_INSERT_COMPONENT_BASIC_RADIO_GROUP: insertComponentDisabledPropsHandler, // RadioGroup
  // RIB_INSERT_COMPONENT_BASIC_RATING: insertComponentDisabledPropsHandler, // Rating
  // RIB_INSERT_COMPONENT_BASIC_NATIVESELECT: insertComponentDisabledPropsHandler, // NativeSelect
  // RIB_INSERT_COMPONENT_BASIC_SELECT: insertComponentDisabledPropsHandler, // Select
  // RIB_INSERT_COMPONENT_BASIC_SLIDER: insertComponentDisabledPropsHandler, // Slider
  // RIB_INSERT_COMPONENT_BASIC_SWITCH: insertComponentDisabledPropsHandler, // Switch
  // RIB_INSERT_COMPONENT_BASIC_TEXTFIELD: insertComponentDisabledPropsHandler, // Textfield
  // RIB_INSERT_COMPONENT_BASIC_TOGGLEBUTTON: insertComponentDisabledPropsHandler, // ToggleButton
  // RIB_INSERT_COMPONENT_BASIC_TOGGLEBUTTONGROUP: insertComponentDisabledPropsHandler, // ToggleButtonGroup
  // // DATA DISPLAY
  // RIB_INSERT_COMPONENT_BASIC_AVATAR: insertComponentDisabledPropsHandler, // Avatar
  // RIB_INSERT_COMPONENT_BASIC_AVATAR_GROUP: insertComponentDisabledPropsHandler, // AvatarGroup
  // RIB_INSERT_COMPONENT_BASIC_BADGE: insertComponentDisabledPropsHandler, // Badge
  // RIB_INSERT_COMPONENT_BASIC_CHIP: insertComponentDisabledPropsHandler, // Chip
  // RIB_INSERT_COMPONENT_BASIC_DIVIDER: insertComponentDisabledPropsHandler, // Divider
  // RIB_INSERT_COMPONENT_BASIC_LIST: insertComponentDisabledPropsHandler, // List
  // RIB_INSERT_COMPONENT_BASIC_LISTITEM: insertComponentDisabledPropsHandler, // ListItem
  // RIB_INSERT_COMPONENT_BASIC_LISTITEMAVATAR: insertComponentDisabledPropsHandler, // ListItemAvatar
  // RIB_INSERT_COMPONENT_BASIC_LISTITEMBUTTON: insertComponentDisabledPropsHandler, // ListItemButton
  // RIB_INSERT_COMPONENT_BASIC_LISTITEMICON: insertComponentDisabledPropsHandler, // ListItemIcon
  // RIB_INSERT_COMPONENT_BASIC_LISTITEMSECONDARYACTION: insertComponentDisabledPropsHandler, // ListItemSecondaryAction
  // RIB_INSERT_COMPONENT_BASIC_LISTITEMTEXT: insertComponentDisabledPropsHandler, // ListItemText
  // RIB_INSERT_COMPONENT_BASIC_LISTSUBHEADER: insertComponentDisabledPropsHandler, // ListSubheader
  // RIB_INSERT_COMPONENT_BASIC_TABLE: insertComponentDisabledPropsHandler, // Table
  // RIB_INSERT_COMPONENT_BASIC_TABLEBODY: insertComponentDisabledPropsHandler, // TableBody
  // RIB_INSERT_COMPONENT_BASIC_TABLECELL: insertComponentDisabledPropsHandler, // TableCell
  // RIB_INSERT_COMPONENT_BASIC_TABLECONTAINER: insertComponentDisabledPropsHandler, // TableContainer
  // RIB_INSERT_COMPONENT_BASIC_TABLEFOOTER: insertComponentDisabledPropsHandler, // TableFooter
  // RIB_INSERT_COMPONENT_BASIC_TABLEHEAD: insertComponentDisabledPropsHandler, // TableHead
  // RIB_INSERT_COMPONENT_BASIC_TABLEPAGINATION: insertComponentDisabledPropsHandler, // TablePagination
  // RIB_INSERT_COMPONENT_BASIC_TABLEROW: insertComponentDisabledPropsHandler, // TableRow
  // RIB_INSERT_COMPONENT_BASIC_TABLESORTLABEL: insertComponentDisabledPropsHandler, // TableSortLabel
  // RIB_INSERT_COMPONENT_BASIC_TOOLTIP: insertComponentDisabledPropsHandler, // Tooltip
  // // FEEDBACK
  // RIB_INSERT_COMPONENT_BASIC_ALERT: insertComponentDisabledPropsHandler, // Alert
  // RIB_INSERT_COMPONENT_BASIC_ALERT_TITLE: insertComponentDisabledPropsHandler, // AlertTitle
  // RIB_INSERT_COMPONENT_BASIC_BACKDROP: insertComponentDisabledPropsHandler, // Backdrop
  // RIB_INSERT_COMPONENT_BASIC_DIALOG_ACTIONS: insertComponentDisabledPropsHandler, // DialogActions
  // RIB_INSERT_COMPONENT_BASIC_DIALOG_CONTENT: insertComponentDisabledPropsHandler, // DialogContent
  // RIB_INSERT_COMPONENT_BASIC_DIALOG_CONTENT_TEXT: insertComponentDisabledPropsHandler, // DialogContentText
  // RIB_INSERT_COMPONENT_BASIC_DIALOG_TITLE: insertComponentDisabledPropsHandler, // DialogTitle
  // RIB_INSERT_COMPONENT_BASIC_CIRCULARPROGRESS: insertComponentDisabledPropsHandler, // CircularProgress
  // RIB_INSERT_COMPONENT_BASIC_SNACKBAR: insertComponentDisabledPropsHandler, // Snackbar
  // RIB_INSERT_COMPONENT_BASIC_SNACKBARCONTENT: insertComponentDisabledPropsHandler, // SnackbarContent
  // RIB_INSERT_COMPONENT_BASIC_SKELETON: insertComponentDisabledPropsHandler, // Skeleton
  // // SURFACES
  // RIB_INSERT_COMPONENT_BASIC_PAPER: insertComponentDisabledPropsHandler, // Paper
  // RIB_INSERT_COMPONENT_BASIC_ACCORDION: insertComponentDisabledPropsHandler, // Accordion
  // RIB_INSERT_COMPONENT_BASIC_ACCORDIONACTIONS: insertComponentDisabledPropsHandler, // AccordionActions
  // RIB_INSERT_COMPONENT_BASIC_ACCORDIONDETAILS: insertComponentDisabledPropsHandler, // AccordionDetails
  // RIB_INSERT_COMPONENT_BASIC_ACCORDIONSUMMARY: insertComponentDisabledPropsHandler, // AccordionSummary
  // RIB_INSERT_COMPONENT_BASIC_APP_BAR: insertComponentDisabledPropsHandler, // AppBar
  // RIB_INSERT_COMPONENT_BASIC_TOOL_BAR: insertComponentDisabledPropsHandler, // ToolBar
  // RIB_INSERT_COMPONENT_BASIC_CARD: insertComponentDisabledPropsHandler, // Card
  // RIB_INSERT_COMPONENT_BASIC_CARDACTIONAREA: insertComponentDisabledPropsHandler, // CardActionArea
  // RIB_INSERT_COMPONENT_BASIC_CARDACTIONS: insertComponentDisabledPropsHandler, // CardActions
  // RIB_INSERT_COMPONENT_BASIC_CARD_CONTENT: insertComponentDisabledPropsHandler, // CardContent
  // RIB_INSERT_COMPONENT_BASIC_CARD_HEADER: insertComponentDisabledPropsHandler, // CardHeader
  // RIB_INSERT_COMPONENT_BASIC_CARD_MEDIA: insertComponentDisabledPropsHandler, // CardMedia
  // RIB_INSERT_COMPONENT_BASIC_BOTTOMNAVIGATION: insertComponentDisabledPropsHandler, // BottomNavigation
  // RIB_INSERT_COMPONENT_BASIC_BOTTOMNAVIGATIONACTION: insertComponentDisabledPropsHandler, // BottomNavigationAction
  // RIB_INSERT_COMPONENT_BASIC_BREADCRUMBS: insertComponentDisabledPropsHandler, // Breadcrumbs
  // RIB_INSERT_COMPONENT_BASIC_TYPOGRAPHY: insertComponentDisabledPropsHandler, // Typography
  // RIB_INSERT_COMPONENT_BASIC_LINK: insertComponentDisabledPropsHandler, // Link
  // RIB_INSERT_COMPONENT_BASIC_DRAWER: insertComponentDisabledPropsHandler, // Drawer
  // RIB_INSERT_COMPONENT_BASIC_SWIPEABLEDRAWER: insertComponentDisabledPropsHandler, // SwipeableDrawer
  // RIB_INSERT_COMPONENT_BASIC_SPEEDDIAL: insertComponentDisabledPropsHandler, // SpeedDial
  // RIB_INSERT_COMPONENT_BASIC_SPEEDDIALACTION: insertComponentDisabledPropsHandler, // SpeedDialAction
  // RIB_INSERT_COMPONENT_BASIC_SPEEDDIALICON: insertComponentDisabledPropsHandler, // SpeedDialIcon
  // RIB_INSERT_COMPONENT_BASIC_CLICKAWAYLISTENER: insertComponentDisabledPropsHandler, // ClickAwayListener
  // RIB_INSERT_COMPONENT_BASIC_MENU: insertComponentDisabledPropsHandler, // Menu
  // RIB_INSERT_COMPONENT_BASIC_MENUITEM: insertComponentDisabledPropsHandler, // MenuItem
  // RIB_INSERT_COMPONENT_BASIC_MENULIST: insertComponentDisabledPropsHandler, // MenuList
  // RIB_INSERT_COMPONENT_BASIC_POPOVER: insertComponentDisabledPropsHandler, // Popover
  // RIB_INSERT_COMPONENT_BASIC_POPPER: insertComponentDisabledPropsHandler, // Popper
  // RIB_INSERT_COMPONENT_BASIC_PAGINATION: insertComponentDisabledPropsHandler, // Pagination
  // RIB_INSERT_COMPONENT_BASIC_PAGINATIONITEM: insertComponentDisabledPropsHandler, // PaginationItem
  // RIB_INSERT_COMPONENT_BASIC_MOBILESTEPPER: insertComponentDisabledPropsHandler, // MobileStepper
  // RIB_INSERT_COMPONENT_BASIC_STEP: insertComponentDisabledPropsHandler, // Step
  // RIB_INSERT_COMPONENT_BASIC_STEPBUTTON: insertComponentDisabledPropsHandler, // StepButton
  // RIB_INSERT_COMPONENT_BASIC_STEPCONNECTOR: insertComponentDisabledPropsHandler, // StepConnector
  // RIB_INSERT_COMPONENT_BASIC_STEPCONTENT: insertComponentDisabledPropsHandler, // StepContent
  // RIB_INSERT_COMPONENT_BASIC_STEPICON: insertComponentDisabledPropsHandler, // StepIcon
  // RIB_INSERT_COMPONENT_BASIC_STEPLABEL: insertComponentDisabledPropsHandler, // StepLabel
  // RIB_INSERT_COMPONENT_BASIC_STEPPER: insertComponentDisabledPropsHandler, // Stepper
  // RIB_INSERT_COMPONENT_BASIC_TAB: insertComponentDisabledPropsHandler, // Tab
  // RIB_INSERT_COMPONENT_BASIC_TAB_CONTEXT: insertComponentDisabledPropsHandler, // TabContext
  // RIB_INSERT_COMPONENT_BASIC_TAB_LIST: insertComponentDisabledPropsHandler, // TabList
  // RIB_INSERT_COMPONENT_BASIC_TAB_PANEL: insertComponentDisabledPropsHandler, // TabPanel
  // RIB_INSERT_COMPONENT_BASIC_TAB_SCROLL_BUTTON: insertComponentDisabledPropsHandler, // TabScrollButton
  // RIB_INSERT_COMPONENT_BASIC_TABS: insertComponentDisabledPropsHandler, // TabS
  // // MUI LAYOUT
  // RIB_INSERT_COMPONENT_BASIC_BOX: insertComponentDisabledPropsHandler, // Box
  // RIB_INSERT_COMPONENT_BASIC_CONTAINER: insertComponentDisabledPropsHandler, // Container
  // RIB_INSERT_COMPONENT_BASIC_GRID: insertComponentDisabledPropsHandler, // Grid
  // RIB_INSERT_COMPONENT_BASIC_STACK: insertComponentDisabledPropsHandler, // Stack
  // RIB_INSERT_COMPONENT_BASIC_IMAGELIST: insertComponentDisabledPropsHandler, // ImageList
  // RIB_INSERT_COMPONENT_BASIC_IMAGELISTITEM: insertComponentDisabledPropsHandler, // ImageListItem
  // RIB_INSERT_COMPONENT_BASIC_IMAGELISTITEMBAR: insertComponentDisabledPropsHandler, // ImageListItemBar
  // // MUI DATE AND TIME PICKERS
  // RIB_INSERT_COMPONENT_BASIC_CALENDAR: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_CALENDARPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_CALENDARPICKERSKELETON: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_CLOCKPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_DATEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_DATETIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_DESKTOPDATEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_DESKTOPDATETIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_DESKTOPTIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_MOBILEDATEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_MOBILEDATETIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_MOBILETIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_MONTHPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_PICKERSDAY: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_STATICDATEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_STATICDATETIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_STATICTIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_TIMEPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_YEARPICKER: insertComponentDisabledPropsHandler,
  // // Office (Dropdown) RIB_INSERT_COMPONENT_OFFICE_DROPDOWN
  // RIB_INSERT_COMPONENT_OFFICE_DROPDOWN: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_OFFICE_WORD: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_OFFICE_CELL: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_OFFICE_POINT: insertComponentDisabledPropsHandler,
  // // 그림 (Dropdown)
  // RIB_INSERT_COMPONENT_BASIC_IMAGE: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_IMAGE_ONLINE: insertRibbonButtonDisabledPropsHandler,
  // // 영상 (Dropdown)
  // RIB_INSERT_COMPONENT_BASIC_VIDEO: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_MEDIA_VIDEO_DROPDOWN: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_MEDIA_VIDEO_ONLINE: insertRibbonButtonDisabledPropsHandler,
  // // 지도 (Dropdown)
  // RIB_INSERT_COMPONENT_MAP_DROPDOWN: insertComponentDisabledPropsHandler,
  // // 아이콘 (Dropdown)
  // RIB_INSERT_COMPONENT_ICON_DROPDOWN: insertComponentDisabledPropsHandler,
  // // 갤러리
  // RIB_INSERT_COMPONENT_BASIC_IMAGE_GALLERY_LOCAL: insertComponentDisabledPropsHandler,
  // // ETC (Dropdown)
  // RIB_INSERT_COMPONENT_BASIC_COLORPICKER: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_DATE: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_DIVISION: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_PARAGRAPH: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_PROGRESSBAR: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_LABEL: insertComponentDisabledPropsHandler,
  // RIB_INSERT_COMPONENT_BASIC_OPTION: insertComponentDisabledPropsHandler,
  // // 컴포넌트 삭제
  // RIB_INSERT_COMPONENT_ETC_DELETE_COMPONENT: deleteComponentDisabledPropsHandler,
  // // ResourceContextMenu
  // TOOLPANE_RESOURCE_COPY_RESOURCE: copyResourcePropsHandler,
  // TOOLPANE_RESOURCE_MOVE_TOP_RESOURCE: moveUpPropsHandler,
  // TOOLPANE_RESOURCE_MOVE_UP_RESOURCE: moveUpPropsHandler,
  // TOOLPANE_RESOURCE_MOVE_DOWN_RESOURCE: moveDownPropsHandler,
  // TOOLPANE_RESOURCE_MOVE_BOTTOM_RESOURCE: moveDownPropsHandler,
  // TOOLPANE_RESOURCE_LOCK_UNLOCK: lockResourcePropsHandler,
  // // 사용자 정의 (Dropdown)
  // RIB_INSERT_COMPONENT_COMPOSITE_COMPONENT_DROPDOWN: uxComponentDropdownPropsHandler,
  // RIB_INSERT_COMPONENT_COMPOSITE_COMPONENT_LIST: insertComponentDisabledPropsHandler, // 사용자 정의 목록 (삽입 버튼)
  // RIB_INSERT_COMPONENT_COMPOSITE_COMPONENT_ADD: templateComponentAddNewComponentPropsHandler, // 사용자 정의 - 새로 추가하기
  // // View
  // RIB_VIEW_PREVIEW_PROJECT: viewProjectPropsHandler, // 프로젝트 미리보기
  // RIB_VIEW_RUN_PROJECT: viewProjectPropsHandler, // 프로젝트 빌드 및 실행
  // // UX Component Tab (사용자 정의)
  // RIB_OPTION_DEFINE_OPTION: optionComponentDisabledPropsHandler,
  // // Business Dialog
  // RIB_DIALOG_LIST: businessDialogListPropsHandler,
  // RIB_DIALOG_REGISTER: businessDialogRegisterPropsHandler,
  // RIB_DIALOG_CLOSE: businessDialogClosePropsHandler,
};

/**
 * Ribbon Item ID를 통해 propHandler 를 반환
 */
export function getPropsHandler(ribbonItem: PropHandlerItem, editorStore: EditorStore): RibbonProp | undefined {
  if (ribbonItem.id === undefined) {
    return undefined;
  }
  const handler = ribbonPropsHandlerMap[ribbonItem.id];
  return handler ? handler(editorStore, ribbonItem.commandPropName) : undefined;
}
