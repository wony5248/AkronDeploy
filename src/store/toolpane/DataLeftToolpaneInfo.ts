import { DataTabIndex } from 'store/app/EditorUIStore';

/**
 * RibbonButton 정보
 */
export interface IDataTabMenuTitle {
  titleID: string;
  child: IDataTabMenu[];
}

/**
 * RibbonTabMenu 정보
 */
export interface IDataTabMenu {
  tabIndex: DataTabIndex;
  imgID: string;
  labelString: string;
}

const variableData: IDataTabMenu = {
  tabIndex: DataTabIndex.VARIABLE_DATA,
  imgID: 'IC_DATA_VARIABLEDATA',
  labelString: '변수 데이터',
};

const objectType: IDataTabMenu = {
  tabIndex: DataTabIndex.OBJECT_TYPE,
  imgID: 'IC_DATA_OBJECTTYPE',
  labelString: '오브젝트 타입',
};

const presetData: IDataTabMenu = {
  tabIndex: DataTabIndex.PRESET_VARIABLE_DATA,
  imgID: 'IC_DATA_PRESETVARIABLEDATA',
  labelString: '프리셋 변수 데이터',
};

const requestService: IDataTabMenu = {
  tabIndex: DataTabIndex.REQUEST_SERVICE,
  imgID: 'IC_DATA_CALLSERVICE',
  labelString: 'DX 서비스 요청',
};

const externalAPI: IDataTabMenu = {
  tabIndex: DataTabIndex.EXTERNAL_API,
  imgID: 'IC_DATA_REGISTERAPI',
  labelString: '외부 API 서비스',
};

const customCode: IDataTabMenu = {
  tabIndex: DataTabIndex.CUSTOM_CODE,
  imgID: 'IC_DATA_CUSTOMCODE',
  labelString: '커스텀 코드',
};

const dataTitle: IDataTabMenuTitle = {
  titleID: '데이터',
  child: [variableData, objectType, presetData],
};

const servieTitle: IDataTabMenuTitle = {
  titleID: '서비스',
  child: [requestService, externalAPI],
};

const developerTitle: IDataTabMenuTitle = {
  titleID: '개발자 모드 (beta)',
  child: [customCode],
};

export const tabMenuItemData: IDataTabMenuTitle[] = [dataTitle, servieTitle, developerTitle];
