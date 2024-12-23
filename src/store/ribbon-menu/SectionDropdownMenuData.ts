import { IRibbonItemProp } from 'store/ribbon-menu/RibbonMenuComponentInfo';

export const SectionContextMenuData: IRibbonItemProp[] = [
  {
    id: 'RIB_PAGE_SECTION_RENAME_SECTION',
    label: '구역 이름 바꾸기',
    type: 'DialogMenuItem',
    commandType: 'Page',
    commandPropName: 'RenameSection',
    image: 'IC_AREA_AREARENAME',
  },
  {
    id: 'RIB_PAGE_SECTION_SEPARATOR_1',
    label: 'SeparatorItem',
    type: 'SeparatorItem',
  },
  {
    id: 'RIB_PAGE_SECTION_DELETE_SECTION',
    label: '구역 제거',
    type: 'NormalMenuItem',
    commandType: 'Page',
    commandPropName: 'DeleteSection',
    image: 'IC_AREA_AREADELETE',
  },
  {
    id: 'RIB_PAGE_SECTION_DELETE_ALL_SECTION',
    label: '모든 구역 제거',
    type: 'NormalMenuItem',
    commandType: 'Page',
    commandPropName: 'DeleteAllSection',
    image: 'IC_AREA_ALLDELETE',
  },
  {
    id: 'RIB_PAGE_SECTION_SEPARATOR_2',
    label: 'SeparatorItem',
    type: 'SeparatorItem',
  },
  {
    id: 'RIB_PAGE_SECTION_SHRINK_ALL_SECTION',
    label: '모두 축소',
    type: 'NormalMenuItem',
    commandType: 'Page',
    commandPropName: 'ShrinkAll',
    image: 'IC_AREA_COLLAPSE',
  },
  {
    id: 'RIB_PAGE_SECTION_EXPAND_ALL_SECTION',
    label: '모두 확장',
    type: 'NormalMenuItem',
    commandType: 'Page',
    commandPropName: 'ExpandAll',
    image: 'IC_AREA_EXPAND',
  },
];

const SectionDropdownMenuData: IRibbonItemProp[] = [
  {
    label: '구역 추가',
    id: 'RIB_PAGE_SECTION_ADD_SECTION',
    type: 'NormalMenuItem',
    commandType: 'Page',
    commandPropName: 'AddSection',
    image: 'IC_AREA_AREAPLUS',
  },
  ...SectionContextMenuData,
];

export default SectionDropdownMenuData;
