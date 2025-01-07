import { isDefined, dLog, dError, Nullable, IWidgetCommonProperties } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { AxiosResponse } from 'axios';
import API from 'models/API/API';
import UpdateMessage from 'models/message/UpdateMessage';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import { AppJson, NodeJson } from 'models/parser/AppParser';
import { APIMessage } from 'models/store/container/UpdateMessageContainer';
import AkronContext from 'models/store/context/AkronContext';
import { SaveState } from 'models/store/EditorStore';
import { HandlerID, ChainID } from 'models/widget/WidgetPropTypes';
import { AppType } from 'store/app/AppInfo';
import { DeviceInfo } from 'util/DeviceUtil';
import { FileInfo } from 'util/FileUtil';

/**
 * 유저 계정 정보를 담는 인터페이스 입니다.
 */
export interface IUserDTO {
  userName: string;
  companyName?: string;
  position?: string;
  phoneNumber?: string;
  email?: string;
}

/**
 * 룸 정보를 담는 인터페이스 입니다.
 */
export interface IRoomDTO {
  roomName: string;
  ownerID: number;
  usedCapacity?: number;
  maxCapacity?: number;
  roomType?: string;
}

/**
 * 서버에서 받아온 앱의 정보를 나타냅니다.
 */
export interface IAppItem {
  appType: AppType;
  appID: number;
  appName: string;
  userID?: number;
  roomID?: number;
  bookmark?: number;
  isShared?: boolean;
  isOwned?: boolean;
  timestamp?: string;
  usedLibraryID?: number;
}

/**
 * 서버에서 받아온 앱의 정보를 나타냅니다.
 */
export interface IPublishedGXInfo {
  appID: number;
  appName: string;
  userID?: number;
  roomID?: number;
  bookmark?: number;
  timestamp?: string;
  author?: string;
  createDate?: string;
  userCreated?: string;
  category?: string;
  appInfo?: string;
  thumbnailFileName?: string;
  categoryInfo: string;
}

/**
 * 서버에서 받아온 UX 컴포넌트 정보.
 */
export interface IPublishedUXInfo {
  appID: number;
  appName: string;
  timestamp?: string;
  // TODO: 기타 정보.
  categoryInfo: string;
}

/**
 * 서버에서 받아온 앱의 정보를 나타냅니다.
 */
export interface ILibraryInfo {
  appID: number;
  categoryInfo: string;
  userCreated: string;
  appWidgetModel: WidgetModel;
  componentItemList: IPublishedComponentItem[];
}

/**
 * 서버에서 받아온 앱의 정보를 나타냅니다.
 */
export interface IPublishedComponentItem {
  appID?: number;
  componentName: string;
  thumbnailFileName: string;
  primaryComponent?: WidgetModel;
  gxPageID?: number;
}

/**
 * template meta interface 입니다.
 */
export interface ITemplateInfo {
  widgetModel?: WidgetModel;
  appID: number;
  type?: string;
  templateInfo?: string;
}

/**
 * App/Template의 component들.
 */
export interface IComponentsData {
  componentList: NodeJson[];
  pageList: NodeJson[];
  appList: NodeJson[];
}

/**
 * createFile input.
 */
export interface ICreateFileInput {
  appType: AppType;
  appID?: number;
  appName: string;
  userID: number;
  roomID?: number;
}

/**
 * createApp input.
 */
export interface ICreateAppInput extends DeviceInfo {
  appType: AppType;
  appID?: number;
  appName: string;
  userID: number;
  roomID?: number;
  appInfo?: string;
}

/**
 * createFile output.
 */
export interface ICreateFileOutput {
  appType: AppType;
  appID?: number;
  appName?: string;
  userID?: number;
  roomID?: number;
  error?: string;
}

/**
 * createComponent input.
 */
export interface ICreateComponentInput {
  referenceAppID?: number;
  userID: number;
  roomID?: number;
  categoryInfo: string;
  libraryName?: string;
}

/**
 * createComponent output.
 */
export interface ICreateComponentOutput {
  componentID?: number;
  userID?: number;
  roomID?: number;
  error?: string;
}

/**
 * createThumbnail input.
 */
export interface ICreatePageThumbnailInput {
  appID: number;
  appType: 'PGX' | 'PUX';
  pageID: number;
  thumbnailFile?: File;
}

/**
 * uploadfile input.
 */
export interface IUploadFileInput {
  appID: number;
  userID: number;
  fileList: Array<File>;
}

/**
 * uploadfile output.
 */
export interface IUploadFileOutput {
  appID: number;
  userID: number;
  // 파일의 원래 이름.
  originalFileName: string;
  // MIME type.
  contentType: string;
  // 서버 상의 파일의 이름.
  fileName: string;
}

/**
 * import app input.
 */
export interface IImportAppInput {
  roomID: number;
  userID: number;
  appName: string;
  file: File;
}

/**
 * uploadfile output.
 */
export interface IImportAppOutput {
  appID: number;
  roomID: number;
  userID: number;
}

/**
 * createTemplate input.
 */
export interface ICreateTemplateInput {
  appID: number;
  type: string;
  templateInfo?: string;
}

/**
 * createTemplate output.
 */
export interface ICreateTemplateOutput {
  appID?: number;
}

/**
 * getAppMeta input.
 */
export interface IGetAppMetaInput {
  appID: number;
}

/**
 * updateAppInfo input.
 */
export interface IUpdateAppInfoInput {
  appInfo: string;
}

/**
 * getAllComponents input.
 */
export interface IGetAppComponentsInput {
  appID: number;
}

/**
 * getTemplateComponents input.
 */
export interface IGetTemplateComponentsInput {
  type: string;
}

/**
 * getTemplateComponents output.
 */
export interface IGetTemplateComponentsOutput {
  templateInfo: Array<ITemplateInfo>;
  componentSet: Set<number>;
}
/**
 * getAppComponents output.
 */
export interface IGetAppComponentsOutput {
  widgetModel?: WidgetModel;
  appID?: number;
  businessDialogMap?: Map<WidgetID, WidgetModel<IWidgetCommonProperties>>;
}

/**
 * getDataStore input.
 */
export interface IGetDataStoreInput {
  dataType: string;
  appID: number;
  componentID?: number;
}

/**
 * getDataStore input.
 */
export interface IGetCodeOutput {
  componentCode: string;
}

/**
 * addComponent input.
 */
export interface IAddComponentInput {
  appID: number;
  componentName: string;
  componentCode: string;
  componentMetaData: string;
  dependency: string;
}

/**
 * Event handler 얻는 API들 output.
 */
export type GetEventHandlersOutput = Array<{
  componentID: number;
  handlerID: number;
  condition: string;
  chainID: number | null | undefined;
  nextID: number | null | undefined;
}>;

/**
 * Component 메시지 정보.
 */
export interface ContentMessageLog {
  appID?: number | undefined;
  componentID?: WidgetID;
  parentID?: number | undefined;
  childID?: number | undefined;
  targetID?: number | undefined;
  nextID?: number | undefined;
  componentTypeID?: number;
  contentData?: string | undefined;
  propertyData?: string | undefined;
  appInfo?: string | undefined;
  behavior?: string | undefined;
  name?: string | undefined;
  propertyKey?: string;
  propertyValue?: any;
  eventMapString?: string | undefined;
  //   dataID?: DataID;
  dataName?: string;
  contentPropertiesString?: string;
  stylePropertiesString?: string;
  logicPropertiesString?: string;
  dataTypeID?: number;
  dataValueString?: string;
  referenceString?: string;
  dataStoreCustomPropsString?: string | undefined;
  dataStoreCustomStatesString?: string | undefined;
  widgetCustomPropsMapString?: string | undefined;
  widgetCustomStatesMapString?: string | undefined;
  referenceDtoString?: string;
  // DTOID, DTODataValueName 과 같이 DTO를 대문자로 표기할 경우 백엔드에서 정상적으로 파싱하지 못함
  variableID?: number | undefined;
  prevVariableID?: number | undefined;
  customPropID?: number | undefined;
  variableMemberKey?: string | undefined;
  customPropsVariableMemberMapString?: string | undefined;
  //   argumentKey?: ArgumentKey | undefined;
  isGXTopLevel?: string;
  //   eventType?: BCEventType;
  handlerID?: HandlerID;
  condition?: string;
  chainID?: ChainID;
  nextHandlerID?: HandlerID;
  //   businessLogicEnum?: BusinessLogicEnum;
  businessLogicArgs?: string;
  nextChainID?: ChainID;
  dataTypeName?: string;
  dataTypeString?: string;
  isList?: string;
  isPreset?: string;
  isLibrary?: string;
  typeReferenceString?: string;
  functionName?: string;
  description?: string;
  code?: string;
}

/**
 * 전송할 데이터의 wrapper.
 */
interface DTO<T> {
  dto: T;
}

/**
 * 비즈니스 다이얼로그 오브젝트 타입
 */
export interface BusinessDialogData {
  businessDialogWidgetID: number;
  businessDialogJSONData: NodeJson;
}

/**
 * 인터넷에서 받아온 파일에 대한 정보.
 */
export interface IGetFileInfoFromURLOutput {
  contentType?: string;
  hasError: boolean;
}

/**
 * 서버에서 받아올 컴포넌트 타입 정보
 */
export interface IGetComponentTypeInfo {
  componentTypeID: number;
  componentName: string;
  componentCategory: string;
}

/**
 * 서버에서 받아올 컴포넌트 타입 정보
 */
export interface IGetPrimitiveTypeInfo {
  primitiveTypeID: number;
}

/**
 * 변수데이터 타입 reference 업데이트 정보
 */
export interface IUpdateVariableTypeRef {
  appID: number;
  dataTypeID: number;
  referenceString: string;
  typeReferenceString: string;
}

/**
 * getregisterfile output.
 */
export type IGetRegisteredFileInfosOutput = FileInfo;

/**
 * messageUpdate result
 */
export type UpdateResult = 'updateComplete' | 'updateError' | 'nonUpdate';

// 서버 상에서도 이 이름으로 구분하므로 서버와 맞춰주세요.
export const libraryTypeNames = ['GXComponent', 'UXComponent', 'UXTemplate'] as const;

/**
 * 지원하는 라이브러리 종류들.
 */
export type LibraryType = (typeof libraryTypeNames)[number];

/**
 * app과 관련된 repository class 입니다.
 * 싱글톤으로 구현되어 있어 앱에 단 하나만 존재합니다.
 * app 관련 model 을 서버로부터 받거나 보냅니다.
 * Model 을 (de)serilaize 합니다.
 */
class AppRepository {
  // ID 생성에 쓸 counter입니다.
  // 앱을 이전에 열었을 때와 (왠만하면) 겹치지 않도록 초기값을 현재 시간으로 설정합니다.

  // 추후 ID 생성이 백엔드로 넘어가면 사라질 예정입니다.
  private nextVariableDataID = new Date().getTime();

  @boundMethod
  public async getAppJson(appId: number): Promise<AppJson> {
    const inputDTO = {
      appId,
    };
    const response = await API.post('/app/json', inputDTO);
    return { components: response.data };
  }

  /**
   * FormData를 생성하여 서버로 POST합니다.
   */
  @boundMethod
  public async sendUpdateMessage(ctx: AkronContext): Promise<UpdateResult> {
    const appModeContainer = ctx.getAppModeContainer();
    const updateMessageContainer = ctx.getUpdateMessageContainer();
    // FormData for Request
    const formData = new FormData();

    // Append documentContent
    const updateMessages = updateMessageContainer.getUpdateMessages() as UpdateMessage[];
    const apiMessages = updateMessageContainer.getAPIMessages();
    const newContentsMessages = new Array<ContentMessageLog>();
    let reSaveMessage = '';
    let executeApiMessages: Array<APIMessage> = [];

    if (ctx.getSaveState() === SaveState.RESAVING) {
      reSaveMessage = updateMessageContainer.getReUpdateMessages();
      formData.append('appContent', reSaveMessage);
      executeApiMessages = updateMessageContainer.getReExecuteAPIMessages();
    } else {
      ctx.setNeedSaveState(false);
      if (updateMessages) {
        formData.append('appContent', JSON.stringify(newContentsMessages));
        updateMessageContainer.clearUpdateMessage();
      }
      if (apiMessages) {
        executeApiMessages = apiMessages;
        updateMessageContainer.clearApiMessage();
      }
    }

    let updateResult: boolean | AxiosResponse<any> = true;
    let messageResponse: boolean | undefined;
    if (updateMessages.length > 0 || reSaveMessage.length > 0) {
      const requestUrl = '/UpdateContentBehavior/putAppContents';
      updateResult = await API.post<FormData>(requestUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data', appID: ctx.getAppID() },
      }).catch(() => {
        return false;
      });
    }
    if (typeof updateResult !== 'boolean' && updateResult.status === 200) {
      messageResponse = true;
      updateMessageContainer.setReUpdateMessages('');
    } else if (!updateResult || (typeof updateResult !== 'boolean' && updateResult.status !== 200)) {
      updateMessageContainer.setReUpdateMessages(JSON.stringify(newContentsMessages));
      updateMessageContainer.setReExecuteAPIMessages(executeApiMessages);
      messageResponse = false;
      return 'updateError';
    }

    let apiResponse: boolean | undefined;
    let head = executeApiMessages.shift();
    while (head) {
      apiResponse = await head();
      if (!apiResponse) {
        executeApiMessages.unshift(head);
        updateMessageContainer.setReExecuteAPIMessages(executeApiMessages);
        break;
      } else {
        head = executeApiMessages.shift();
      }
    }
    if (!apiResponse) {
      return 'updateError';
    }

    if (messageResponse === undefined) {
      if (apiResponse === undefined) {
        return 'nonUpdate';
      }
      if (apiResponse === true) {
        return 'updateComplete';
      }
    } else if (messageResponse === true) {
      if (apiResponse === true) {
        return 'updateComplete';
      }
      if (apiResponse === undefined) {
        return 'updateComplete';
      }
    }
    return 'updateError';
  }

  /**
   * 새로운 파일을 생성하여 서버로 POST합니다.
   */
  @boundMethod
  public async createFile(input: ICreateFileInput): Promise<ICreateFileOutput> {
    const response = await API.post<DTO<ICreateFileInput>>('/FileBehavior/createFile', {
      dto: input,
    });

    const newFile: ICreateFileOutput = response.data;
    return newFile;
  }

  /**
   * 다른 이름으로 앱을 저장하기 위해 서비스를 호출합니다.
   * 요청받은 서버는 현재앱과 동일한 복사본을 생성 후, 입력받은 appName으로 설정합니다.
   * 이미 앱이름이 있을 경우 에러스트링을 호출합니다.
   */
  @boundMethod
  public async saveAppAs(input: ICreateAppInput): Promise<ICreateFileOutput> {
    const response = await API.post<DTO<ICreateFileInput>>('/app/saveAs', {
      dto: input,
    });

    const newFile: ICreateFileOutput = response.data;
    return newFile;
  }

  /**
   * 서버에 파일을 업로드하고 파일의 정보(MIME type, 저장 시의 이름, ...)를 가져옴.
   */
  @boundMethod
  public async uploadFile(input: IUploadFileInput): Promise<Array<IUploadFileOutput>> {
    const formData = new FormData();

    input.fileList.forEach(file => {
      formData.append('fileList', file);
    });

    const response = await API.post<FormData>(
      `/FileBehavior/file?appID=${input.appID}&userID=${input.userID}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data;
  }

  //   /**
  //    * 서버에 앱을 import 함, import 완료 후 appID를 받음
  //    */
  //   @boundMethod
  //   public async importApp(input: IImportAppInput): Promise<void> {
  //     let importedApp = JSON.parse(await input.file.text());

  //     importedApp = convertPkgToRecent(importedApp);
  //     dLog(importedApp);

  //     await API.post(`/app/import?userID=${input.userID}&roomID=${input.roomID}&appName=${input.appName}`, importedApp);
  //   }

  //   /**
  //    * 앱을 JS object 형태로 export하여 반환합니다. Export를 사용하는 기능들 구현에 사용하는 공통 로직입니다.
  //    */
  //   @boundMethod
  //   private async exportApp(appID: number, appName: string) {
  //     const response = await API.get(`/app/export?appID=${appID}`);

  //     const exportedApp: PkgType = response.data;
  //     exportedApp.version = deployPkgVersionMap[superuxDeployVersion];
  //     return exportedApp;
  //   }

  //   /**
  //    * 앱을 export하고 json 파일로 다운로드합니다.
  //    */
  //   @boundMethod
  //   public async exportAppAndDownload(appID: number, appName: string) {
  //     const exportedApp = await this.exportApp(appID, appName);
  //     const blob = new Blob([JSON.stringify(exportedApp, null, 2)], { type: 'application/json' });

  //     const FileUtil = await import('ux/util/FileUtil');
  //     FileUtil.downloadDataAsFile(`${appName}.json`, blob);
  //   }

  //   /**
  //    * 앱을 빌드하고 zip 파일로 다운로드합니다.
  //    */
  //   @boundMethod
  //   public async buildAppAndDownload(appID: number, appName: string, addLog: (log: string) => void) {
  //     // 브라우저 캐싱 방지를 위하여 파일 이름이 매번 달라지도록 뒤에 붙임.
  //     const nameTail = `-${new Date().getTime()}`;

  //     // 런타임 zip 파일을 읽어옵니다. 이 안에 필요한 파일들을 추가할 것입니다.
  //     addLog('런타임 읽는 중...');
  //     const distName = 'dist';
  //     const runtimeZipResponse = await API.get(`/runtime/${distName}.zip`, { baseURL: '', responseType: 'blob' });
  //     const runtimeZipBlob = runtimeZipResponse.data;

  //     const appZip = await JSZip.loadAsync(runtimeZipBlob);

  //     // 최상위에 dist 폴더 있을 시 내용물들을 폴더 밖으로 꺼냄.
  //     await removeRootFromZip(appZip, distName);

  //     // 런타임 js.
  //     addLog('런타임 js 추가...');
  //     const runnerJS = await appZip.file('runner.js')!.async('string');
  //     const targetRunnerJSName = `runner${nameTail}.js`;
  //     appZip.remove('runner.js');
  //     appZip.file(targetRunnerJSName, runnerJS);

  //     // Export 기능을 (재)사용하여 JSON을 얻어오고, 해당 JSON을 입력으로 하여 런타임을 실행해주는 JS 파일을 만듭니다.
  //     addLog('앱 실행 js 추가...');
  //     const appJSON = await this.exportApp(appID, appName);

  //     const appJS = `
  // const appJson = ${JSON.stringify(appJSON)};

  // // 런타임 js가 deferred script이므로, 그 이후에 스크립트를 실행하려면 load 이벤트 필요.
  // // https://stackoverflow.com/a/59937330
  // window.addEventListener('load', () => {
  //     SuperUX.runAppFromArgs(appJson);
  // });
  // `;

  //     const targetAppJSName = `app${nameTail}.js`;
  //     appZip.file(targetAppJSName, appJS);

  //     // 정적으로 쓸 데이터들.
  //     addLog('데이터 로더들 추가...');
  //     const componentTypeList = await this.getComponentTypeList();
  //     const customComponentTypeList = await this.getCustomComponentTypeList();
  //     const serviceUrl = `/component/GetMetaData/?packageName=UserCreated&version=Latest`;
  //     const response = await RuntimeRepository.getRuntimeAPI().get(serviceUrl);
  //     const contents = response.data;

  //     const WidgetPackageJSON = contents.data;

  //     const targetPreloadJSName = `PreloadData${nameTail}.js`;
  //     appZip.file(
  //       targetPreloadJSName,
  //       `console.log("Pre-loading data...");

  // window.SuperUX.componentTypeList = ${JSON.stringify(componentTypeList, null, 4)};

  // window.SuperUX.customComponentTypeList = ${JSON.stringify(customComponentTypeList, null, 4)};

  // window.SuperUX.userCreatedPackageJSON = ${JSON.stringify(WidgetPackageJSON, null, 4)};
  // `
  //     );

  //     // 스튜디오 컴포넌트.
  //     addLog('스튜디오 컴포넌트 추가...');
  //     const studioZipResponse = await API.get(`/studio-component/dist.zip`, { baseURL: '', responseType: 'blob' });
  //     const studioZipBlob = studioZipResponse.data;
  //     const studioZip = await JSZip.loadAsync(studioZipBlob);

  //     await removeRootFromZip(studioZip, 'dist-studio-component');

  //     const studioItemInfos: Array<[string, JSZipObject]> = [];

  //     // JSZip.forEach는 subfolder도 읽으므로 재귀는 필요 X.
  //     studioZip.forEach((itemPath, item) => {
  //       studioItemInfos.push([itemPath, item]);
  //     });

  //     const targetStudioJSName = `studio-component${nameTail}.js`;

  //     for (let i = 0; i < studioItemInfos.length; i++) {
  //       const [itemPath, item] = studioItemInfos[i];

  //       // 리소스들.
  //       if (itemPath.includes('locales') || itemPath.includes('.ttf')) {
  //         // eslint-disable-next-line no-await-in-loop
  //         const content = await item.async('uint8array');
  //         appZip.file(itemPath, content);
  //       }
  //       // 스튜디오 js.
  //       else if (itemPath === 'index.js') {
  //         // eslint-disable-next-line no-await-in-loop
  //         const content = await item.async('uint8array');
  //         appZip.file(targetStudioJSName, content);
  //       }
  //     }

  //     // 이미지, 비디오 등 앱에 들어간 파일들을 다운로드하여 ZIP에 넣습니다.
  //     addLog('필요 파일들 (ex. 이미지) 다운로드 & 추가 중...');
  //     const fileInfos = await this.getRegisteredFileInfos(appID);

  //     await Promise.all(
  //       fileInfos.map(async ({ fileName }) => {
  //         try {
  //           const contentTypeParam = encodeURIComponent('application/octet-stream');

  //           const fileResponse = await API.get(
  //             `/FileBehavior/file?appID=${appID}&contentType=${contentTypeParam}&fileName=${encodeURIComponent(
  //               fileName
  //             )}`,
  //             { responseType: 'blob' }
  //           );

  //           const fileBlob = fileResponse.data;
  //           appZip.file(`file/${fileName}`, fileBlob);
  //           dLog(`---- ${fileName}: 성공`);
  //         } catch (error) {
  //           dError(`---- ${fileName}: 실패`, error);
  //         }
  //       })
  //     );

  //     // 설정 파일을 추가합니다.
  //     addLog('설정 파일 다운로드 & 추가 중...');
  //     const globalConfigName = 'GlobalConfig.js';
  //     const globalConfigCode = (await API.get(`/${globalConfigName}`, { baseURL: '', responseType: 'text' })).data;
  //     const targetConfigName = `GlobalConfig${nameTail}.js`;
  //     appZip.file(targetConfigName, globalConfigCode);

  //     // 위 JS 파일을 실행해 줄 HTML 파일을 만듭니다.
  //     addLog('index.html 생성 중...');

  //     const indexHTML = `
  // <!DOCTYPE html>

  // <html lang="ko">
  //     <head>
  //         <meta charset="UTF-8" />
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         <title>${appName}</title>
  //         <!--SuperUX runtime.-->
  //         <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  //         <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
  //         <script src="${targetConfigName}"></script>
  //         <script src="${targetPreloadJSName}"></script>
  //         <script defer src="${targetStudioJSName}"></script>
  //         <script defer src="${targetRunnerJSName}"></script>
  //     </head>

  //     <body>
  //         <div class="root">
  //             <!--React가 여기에 element들을 생성합니다.-->
  //         </div>
  //         <script src="${targetAppJSName}"></script>
  //     </body>
  // </html>
  // `;

  //     appZip.file('index.html', indexHTML);

  //     // 생성한 ZIP 파일을 다운로드합니다.
  //     addLog('완성한 ZIP 다운로드 중...');
  //     const FileUtil = await import('ux/util/FileUtil');
  //     FileUtil.downloadDataAsFile(`${appName}.zip`, await appZip.generateAsync({ type: 'blob' }));
  //   }

  /**
   * 현재 앱에서 어떤 컴포넌트들이 어떤 파일들을 사용하는지 가져오기.
   */

  /**
   * 새로운 템플릿 생성하여 서버로 POST합니다.
   */
  @boundMethod
  public async createTemplate(input: ICreateTemplateInput): Promise<ICreateTemplateOutput> {
    return API.post<DTO<ICreateTemplateInput>>('/TemplateBehavior/createTemplate', {
      dto: input,
    })
      .then(newTemplate => {
        return newTemplate.data;
      })
      .catch(() => {
        return { appID: -1 };
      });
  }

  /**
   * AppMeta get
   */
  public async getAppMeta(
    input: IGetAppMetaInput
  ): Promise<{ appInfo: string; appName: string; deviceInfo: DeviceInfo }> {
    const serviceUrl = `/FileBehavior/appMeta/?appID=${input.appID}`;
    return API.get(serviceUrl).then(response => {
      const appMeta = response.data;
      const { appInfo, appName, deviceInfo } = appMeta;
      return { appInfo, appName, deviceInfo };
    });
  }

  /**
   * Library(PGX) Meta get
   */
  public async getLibraryMeta(appID: number, libraryType: LibraryType): Promise<IPublishedGXInfo> {
    const serviceUrl = `/FileBehavior/libraryAppMeta/?appID=${appID}&libraryType=${libraryType}`;
    const response = await API.get(serviceUrl);
    const libraryMeta: IPublishedGXInfo = response.data;

    return libraryMeta;
  }

  /**
   * 사용자가 등록한 라이브러리의 app meta 정보를 가져옵니다.
   */
  public async getUsedLibraryMeta(appID: number, libraryType: LibraryType): Promise<IPublishedGXInfo> {
    const serviceUrl = `/FileBehavior/usedLibraryAppMeta/?appID=${appID}&libraryType=${libraryType}`;
    const response = await API.get(serviceUrl);
    const libraryMeta: IPublishedGXInfo = response.data;

    return libraryMeta;
  }

  /**
   * 서버로부터 DataStore 데이터를 get합니다.
   * dataType에 따라 ViewData, VariableData, WidgetCustomProp, WidgetCustomState를 가져옵니다.
   */
  public async getDataStoreData<T>(dataInput: IGetDataStoreInput): Promise<T> {
    const serviceUrl = `/dataStore/${dataInput.dataType}/?appID=${dataInput.appID}`;
    const response = await API.get(serviceUrl);
    return response.data;
  }

  /**
   * 서버로부터 Publish된 데이터를 get합니다.
   * dataType에 따라 WidgetCustomProp, WidgetCustomState를 가져옵니다.
   */
  public async getPublishedDataStoreData<T>(dataInput: IGetDataStoreInput): Promise<T> {
    let serviceUrl = `/dataStore/${dataInput.dataType}/?appID=${dataInput.appID}`;
    if (isDefined(dataInput.componentID)) {
      serviceUrl = `/dataStore/${dataInput.dataType}/?appID=${dataInput.appID}&componentID=${dataInput.componentID}`;
    }
    const response = await API.get(serviceUrl);
    return response.data;
  }

  //   /**
  //    * 서버로부터 해당 App의 모든 CustomPropertyVariableMap 데이터를 get합니다.
  //    */
  //   public async getCompCustomPropertyVariableData(appID: number): Promise<CompCustomPropertyVariableDataDTO[]> {
  //     const serviceUrl = `/UpdateContentBehavior/getAllCustomPropertyVariableMap/?appID=${appID}`;
  //     const response = await API.get(serviceUrl);
  //     return response.data;
  //   }

  //   /**
  //    * 서버로부터 Publish된 CustomPropertyVariableMap 데이터를 get합니다.
  //    */
  //   public async getPublishCompCustomPropertyVariableData(
  //     appID: number,
  //     componentID: number
  //   ): Promise<CompCustomPropertyVariableDataDTO[]> {
  //     const serviceUrl = `/UpdateContentBehavior/getPublishCustomPropertyVariableMap/?appID=${appID}&componentID=${componentID}`;
  //     const response = await API.get(serviceUrl);
  //     return response.data;
  //   }

  //   /**
  //    * 서버로부터 해당 App의 모든 CustomPropertyDtoMap 데이터를 get합니다.
  //    */
  //   public async getBusinessArgumentMappingInfoData(appID: number): Promise<BusinessArgumentBindingInfoDTO[]> {
  //     const serviceUrl = `/UpdateContentBehavior/getAllBusinessArgumentMappingInfoDTO/?appID=${appID}`;
  //     const response = await API.get(serviceUrl);
  //     return response.data;
  //   }

  /**
   * 서버로부터 Callback 데이터를 받아옵니다.
   */
  public async getCallbacks(appID: number) {
    const serviceUrl = `/UpdateContentBehavior/getAllCallbackMapInfoDTO/?appID=${appID}`;
    const response = await API.get(serviceUrl);
    return response.data;
  }

  /**
   * 서버로부터 Event Handler 데이터를 받아옵니다.
   */
  public async getEventHandlers(appID: number): Promise<GetEventHandlersOutput> {
    const serviceUrl = `/UpdateContentBehavior/getAllEventHandlerInfoDTO/?appID=${appID}`;
    const response = await API.get(serviceUrl);
    return response.data;
  }

  /**
   * 서버로부터 사용 중인 라이브러리에 대한 Event Handler 데이터를 받아옵니다.
   */
  public async getUsedLibraryEventHandlers(appID: number, libraryType: LibraryType): Promise<GetEventHandlersOutput> {
    const serviceUrl = `/UpdateContentBehavior/getUsedLibraryEventHandlers/?appID=${appID}&libraryType=${libraryType}`;
    const response = await API.get(serviceUrl);
    return response.data;
  }

  /**
   * 서버로부터 Business Component Chain 데이터를 받아옵니다.
   */
  public async getBusinessComponentChains(appID: number) {
    const serviceUrl = `/UpdateContentBehavior/getAllBusinessComponentChainInfoDTO/?appID=${appID}`;
    const response = await API.get(serviceUrl);
    return response.data;
  }

  /**
   * 서버로부터 사용 중인 라이브러리에 대한 Business Component Chain 데이터를 받아옵니다.
   */
  public async getUsedLibraryBusinessComponentChains(appID: number, libraryType: LibraryType) {
    const serviceUrl = `/UpdateContentBehavior/getUsedLibraryBusinessComponentChains/?appID=${appID}&libraryType=${libraryType}`;
    const response = await API.get(serviceUrl);
    return response.data;
  }

  //   /**
  //    * 서버로부터 사용 중인 라이브러리에 대한 Custom Code 데이터를 받아옵니다.
  //    */
  //   public async getUsedLibraryAllCustomCodeList(appID: number, libraryType: LibraryType): Promise<ICustomCodeDTO[]> {
  //     const serviceUrl = `/UpdateContentBehavior/getUsedLibraryAllCustomCodeList/?appID=${appID}&libraryType=${libraryType}`;
  //     const response = await API.get(serviceUrl);
  //     return response.data;
  //   }

  /**
   * 서버로부터 사용 중인 라이브러리에 대한 View Data 데이터를 받아옵니다.
   */
  public async getUsedLibraryViewDataList(appID: number, libraryType: LibraryType) {
    const serviceUrl = `/UpdateContentBehavior/getUsedLibraryViewDataList/?appID=${appID}&libraryType=${libraryType}`;
    const response = await API.get(serviceUrl);
    return response.data;
  }

  //   /**
  //    * 서버로부터 사용 중인 라이브러리에 대한 Variable Data 데이터를 받아옵니다.
  //    */
  //   public async getUsedLibraryVariableDataList(
  //     appID: number,
  //     libraryType: LibraryType
  //   ): Promise<Array<VariableDataObject>> {
  //     const serviceUrl = `/UpdateContentBehavior/getUsedLibraryVariableDataList/?appID=${appID}&libraryType=${libraryType}`;
  //     const response = await API.get(serviceUrl);
  //     return response.data;
  //   }

  //   /**
  //    * 서버로부터 사용 중인 라이브러리에 대한 Variable Data Type 데이터를 받아옵니다.
  //    */
  //   public async getUsedLibraryVariableDataTypeList(
  //     appID: number,
  //     libraryType: LibraryType
  //   ): Promise<Array<VariableDataTypeObject>> {
  //     const serviceUrl = `/UpdateContentBehavior/getUsedLibraryVariableDataTypeList/?appID=${appID}&libraryType=${libraryType}`;
  //     const response = await API.get(serviceUrl);
  //     return response.data;
  //   }

  //   /**
  //    * 서버로부터 사용 중인 라이브러리에 대한 외부 서비스 서버 데이터를 받아옵니다.
  //    */
  //   public async getUsedLibraryExternalServiceServers(
  //     appID: number,
  //     libraryType: LibraryType
  //   ): Promise<Array<IExternalServiceServerModelDTO>> {
  //     const response = await API.get(
  //       `/UpdateContentBehavior/getUsedLibraryExternalServiceServers?appID=${appID}&libraryType=${libraryType}`
  //     );

  //     return response.data;
  //   }

  //   /**
  //    * 서버로부터 사용 중인 라이브러리에 대한 외부 서비스 데이터를 받아옵니다.
  //    */
  //   public async getUsedLibraryExternalServices(
  //     appID: number,
  //     libraryType: LibraryType
  //   ): Promise<Array<IExternalServiceModelDTO>> {
  //     const response = await API.get(
  //       `/UpdateContentBehavior/getUsedLibraryExternalServices?appID=${appID}&libraryType=${libraryType}`
  //     );

  //     return response.data;
  //   }

  //   /**
  //    * 서버로부터 사용 중인 라이브러리에 대한 외부 서비스 DTO 데이터를 받아옵니다.
  //    */
  //   public async getUsedLibraryExternalServiceDTOs(
  //     appID: number,
  //     libraryType: LibraryType
  //   ): Promise<Array<IExternalServiceDTOModelDTO>> {
  //     const response = await API.get(
  //       `/UpdateContentBehavior/getUsedLibraryExternalServiceDTOs?appID=${appID}&libraryType=${libraryType}`
  //     );

  //     return response.data;
  //   }

  /**
   * AppInfo update
   */
  public async updateAppInfo(input: IUpdateAppInfoInput): Promise<boolean> {
    if (isDefined(input.appInfo)) {
      return API.post<DTO<string>>('/FileBehavior/appInfo', {
        dto: input.appInfo,
      }).then(response => {
        const res: string = response.data;
        if (res.includes('FAIL')) {
          return false;
        }
        dLog('save succeed');
        return true;
      });
    }
    return new Promise(() => false);
  }

  /**
   * 서버로 부터 app 관련 컴포넌트들을 받아와 DOM을 생성하는 parser에 넘겨줌
   */
  @boundMethod
  public async getAppComponents(input: IGetAppComponentsInput): Promise<Nullable<IComponentsData>> {
    const response = await API.post<DTO<IGetAppComponentsInput>>('/document/DocumentBehavior/getAppComponents', {
      dto: input,
    });
    if (response.data === 'Fail') {
      dLog('getAppComponents API 에러가 발생했습니다. 담당자에게 문의주세요.');
      return undefined;
    }
    const appData: IComponentsData = response.data;
    return appData;
  }

  /**
   * 서버로부터 사용 중인 라이브러리 관련 컴포넌트들을 받아와 DOM을 생성하는 parser에 넘겨줌
   */
  @boundMethod
  public async getUsedLibraryComponents(appID: number, libraryType: LibraryType): Promise<Nullable<IComponentsData>> {
    const serviceUrl = `/document/DocumentBehavior/getUsedLibraryComponents/?appID=${appID}&libraryType=${libraryType}`;
    const response = await API.get(serviceUrl);
    const appData: IComponentsData = response.data;

    return appData;
  }

  /**
   * GX Project로부터 GX Component를 생성하여 서버에 저장합니다.
   */
  @boundMethod
  public async publishGXComponent(input: ICreateComponentInput): Promise<ICreateComponentOutput> {
    const response = await API.post<DTO<ICreateComponentInput>>('/app/publishGXComponent', {
      dto: input,
    });

    const newComponent: ICreateComponentOutput = response.data;
    return newComponent;
  }

  /**
   * UX Project로부터 UX Component를 생성하여 서버에 저장합니다.
   */
  @boundMethod
  public async publishUXComponent(input: ICreateComponentInput): Promise<ICreateComponentOutput> {
    const response = await API.post<DTO<ICreateComponentInput>>('/app/publishUXComponent', {
      dto: input,
    });

    const newComponent: ICreateComponentOutput = response.data;
    return newComponent;
  }

  /**
   * UX Project로부터 UX Template를 생성하여 서버에 저장합니다.
   */
  @boundMethod
  public async publishUXTemplate(input: ICreateComponentInput): Promise<ICreateComponentOutput> {
    const response = await API.post<DTO<ICreateComponentInput>>('/app/publishUXTemplate', {
      dto: input,
    });

    const newComponent: ICreateComponentOutput = response.data;
    return newComponent;
  }

  /**
   * Publish 완료된 각 component들의 썸네일에 대한 정보를 서버에 저장합니다.
   */
  @boundMethod
  public async updateThumbnailFile(input: ICreatePageThumbnailInput) {
    const formData = new FormData();

    formData.append('appID', `${input.appID}`);
    formData.append('appType', `${input.appType}`);
    formData.append('pageID', `${input.pageID}`);
    if (input.thumbnailFile) {
      formData.append('thumbnailFile', input.thumbnailFile);
    }
    await API.post<FormData>('/FileBehavior/updateThumbnailFile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * GX에서 생성된 Component들의 meta data를 서버로부터 받아옵니다.
   */
  @boundMethod
  public async getPresetLibraryAppInfo(): Promise<IPublishedGXInfo[]> {
    const serviceUrl = `/app/getPresetLibraryInfo`;
    const response = await API.get(serviceUrl);
    const presetLibraryInfo: IPublishedGXInfo[] = response.data;

    return presetLibraryInfo;
  }

  /**
   * GX에서 생성된 Component들의 meta data 중 userCreated가 true인 값들을 서버로부터 받아옵니다.
   */
  @boundMethod
  public async getLibraryAppInfo(libraryType: LibraryType): Promise<IPublishedGXInfo[]> {
    const serviceUrl = `/app/getLibraryInfo?libraryType=${libraryType}`;
    const response = await API.get(serviceUrl);
    const publishedGXInfoList: IPublishedGXInfo[] = response.data;

    return publishedGXInfoList;
  }

  //   /**
  //    * 서버로부터 UX Component 의 MetaData를 load 합니다
  //    */
  //   @boundMethod
  //   public async loadUXComponentMetaData(): Promise<Nullable<UXComponentDataInterface[]>> {
  //     // TODO. Server, DB와 연결 필요
  //     // ViewComponent MetaData와 유사하게 동작하면 될 것으로 보임
  //     // VC의 경우 PackageName, Version 으로 get 하지만,
  //     // UXComponent 는 사용자 ID로 구분하여, 해당 사용자가 등록한 목록을 보여주면 될 것으로 생각 됨
  //     // API.get()?
  //     // const templateMetaDataList: WidgetMetaDataWidgetInterface[] = response.data;
  //     const templateMetaDataString: string = JSON.stringify(LocalUXComponentMetaData);
  //     const templateMetaDataList: UXComponentDataInterface[] = JSON.parse(templateMetaDataString);

  //     return templateMetaDataList;
  //   }

  /**
   * UX Component MetaData를 서버로 update
   */
  @boundMethod
  public async saveUXComponentMetaData(id: number): Promise<Nullable<string>> {
    /**
     * MetaData DB 와 통신하기 위한 DTO
     */
    interface UXComponentMetaDataDTO {
      userID: string;
      id: number;
      data: string;
    }

    // let result: string = '';
    // const serviceUrl = '/component/SetUXComponentMetaData';
    // API.post<UXComponentMetaDataDTO>(serviceUrl, {
    //     userID: '',
    //     id,
    //     data: JSON.stringify('DATA'),
    // })
    //     .then(() => {
    //         result = 'UXComponent MetaData Save Success!';
    //     })
    //     .catch(() => {
    //         result = 'UXComponent MetaData Save Fail!';
    //     });
    // return result;
    return '';
  }

  /**
   * Widget에 할당할 ID를 생성합니다.
   * 후에 백엔드 쪽에서 ID를 생성할 예정이며, 그 때 이 함수는 **삭제될 예정입니다.**
   */
  @boundMethod
  public generateVariableDataID(id?: number): number {
    // id가 input으로 경우는 이전에 dataStore의 variable 데이터가 존재한 경우
    // if (isDefined(id)) {
    //     this.nextVariableDataID = id + 1;
    //     return this.nextVariableDataID;
    // } else {
    //     const newVariableDataID = this.nextVariableDataID;
    //     this.nextVariableDataID += 1;
    //     return newVariableDataID;
    // }
    const newVariableDataID = this.nextVariableDataID;
    this.nextVariableDataID += 1;
    return newVariableDataID;
  }

  /**
   * 앱이름을 변경하고 싶을 때 사용하는 API 입니다. appID와 appName을 파라미터로 받습니다.
   * 동일한 앱이름이 이미 있을 경우, 앱이름 변경을 하지 않으며 status code 400을 반환합니다.
   */
  public async updateAppName(appID: number, roomID: number, appName: string): Promise<boolean> {
    const serviceURL = `/app/name`;
    const response = await API.put(serviceURL, null, { params: { appID, roomID, appName } });
    if (response.status === 400) {
      return false;
    }

    return true;
  }

  /**
   * 새로운 파일을 생성하여 서버로 POST합니다. 유효한 roomID, userID 값을 DTO에 채워서 호출하세요
   * 추후 createFile은 삭제될 예정입니다.
   */
  public async createApp(input: ICreateFileInput | ICreateAppInput): Promise<ICreateFileOutput> {
    const response = await API.post<DTO<ICreateFileInput>>('/app/createApp', {
      dto: input,
    });

    const newFile: ICreateFileOutput = response.data;
    return newFile;
  }

  /**
   * userID에 해당하는 앱들의 정보를 가져옵니다.
   */
  public async getUserApps(userID: number): Promise<IAppItem[]> {
    const serviceUrl = `/app/getUserApps/?userID=${userID}`;
    const response = await API.get(serviceUrl);
    const appList: IAppItem[] = response.data;
    return appList;
  }

  /**
   * roomID에 해당하는 앱들의 정보를 가져옵니다.
   */
  public async getRoomApps(roomID: number): Promise<IAppItem[]> {
    const serviceUrl = `/app/getRoomApps/?roomID=${roomID}`;
    const response = await API.get(serviceUrl);
    const appList: IAppItem[] = response.data;
    return appList;
  }

  /**
   * roomID 목록에 해당하는 앱들의 정보를 가져옵니다.
   */
  public async getRoomsApps(roomIDs: number[], userID: number): Promise<IAppItem[]> {
    const serviceUrl = `/app/getRoomsApps`;
    const response = await API.post(serviceUrl, { roomIDs, userID });
    const appList: IAppItem[] = response.data;
    return appList;
  }

  /**
   * -1번 룸에 속한 appItem들을 myRoom으로 변경합니다.
   */
  public async changeAppsToMyRoom(appIDs: number[], myRoomID: number): Promise<boolean> {
    const serviceUrl = `/app/changeAppsToMyRoom`;
    const response = await API.post(serviceUrl, { appIDs, myRoomID });
    const appList: boolean = response.data;
    return appList;
  }

  /**
   * 유저 정보를 서버에 저장합니다. 저장 완료 후, userID를 발급 받습니다.
   */
  public async createUser(user: IUserDTO): Promise<number> {
    const serviceUrl = `/user/create`;
    const response = await API.post<IUserDTO>(serviceUrl, user);
    const userID: number = response.data;
    return userID;
  }

  /**
   * 룸 정보를 서버에 저장합니다. 저장 완료 후, roomID를 발급 받습니다.
   */
  public async createRoom(room: IRoomDTO): Promise<number> {
    const serviceUrl = `/room/create`;
    const response = await API.post<IRoomDTO>(serviceUrl, room);
    const roomID: number = response.data;
    return roomID;
  }

  /**
   * 유저 ID를 가져옵니다. 없을 시에는 저장 완료 후, userID를 발급 받습니다.
   */
  public async getOrCreateUser(user: IUserDTO): Promise<number> {
    const serviceUrl = `/user/getOrCreate`;
    const response = await API.post<IUserDTO>(serviceUrl, user);
    const userID: number = response.data;
    return userID;
  }

  /**
   * 룸 정보를 가져옵니다. 없을 시에는 저장 완료 후, roomID를 발급 받습니다.
   */
  public async getOrCreateRoom(room: IRoomDTO): Promise<number> {
    const serviceUrl = `/room/getOrCreate`;
    const response = await API.post<IRoomDTO>(serviceUrl, room);
    const roomID: number = response.data;
    return roomID;
  }

  /**
   * 북마크를 업데이트 합니다.
   * 앱의 북마크 값이 1이면 즐겨찾기 추가된 상태
   * 앱의 북마크 값이 0이면 즐겨찾기 해제된 상태
   */
  public async updateBookmark(appID: number, bookmark: number): Promise<boolean> {
    const serviceUrl = `/app/bookmark`;
    const response = await API.put(serviceUrl, null, { params: { appID, bookmark } });
    if (response.status >= 200 && response.status < 300) {
      return true;
    }
    return false;
  }

  /**
   * UX/GX 프로젝트에서 사용 중인 라이브러리 정보를 업데이트 합니다.
   */
  public async updateUsedLibraryID(appID: number, usedLibraryID: number, libraryType: LibraryType) {
    const serviceUrl = `/app/updateUsedLibraryID`;
    await API.put(serviceUrl, null, { params: { appID, usedLibraryID, libraryType } });
  }

  /**
   * 주어진 URL에 해당하는 파일의 정보를 알아냅니다.
   */
  public async getFileInfoFromURL(url: string): Promise<IGetFileInfoFromURLOutput> {
    const response = await API.get(`/file/externalFileInfo`, { params: { url } });
    return response.data;
  }

  /**
   * Component DB에 등록된 ID, name을 조회합니다.
   */
  public async getComponentTypeList(): Promise<IGetComponentTypeInfo[]> {
    const response = await API.get(`/component/GetComponentTypeList`);

    return response.data;
  }

  /**
   * Component DB에 등록된 ID, name을 조회합니다.
   */
  public async getCustomComponentTypeList(): Promise<IGetComponentTypeInfo[]> {
    const response = await API.get(`/component/GetCustomComponentTypeList`);

    return response.data;
  }

  /**
   * Component DB에 등록된 여러 개의 Component Source를 가져옵니다.
   */
  public async getComponentCodes(compList: number[]): Promise<IGetCodeOutput[]> {
    const serviceUrl = `/component/GetComponentCodes`;
    const response = await API.post(serviceUrl, compList);
    return response.data;
  }

  /**
   * deviceInfo 업데이트
   */
  public async updateDeviceInfo(deviceInfo: DeviceInfo): Promise<boolean> {
    const serviceUrl = `/app/deviceInfo`;
    try {
      const response = await API.put(serviceUrl, { dto: deviceInfo });
      if (response.status >= 200 && response.status < 300) {
        return true;
      }
      dError('updateDeviceInfo failed');
      return false;
    } catch (e) {
      dError('updateDeviceInfo failed');
      return false;
    }
  }

  /**
   * PGX의 BasicImage/BasicVideo 컴포넌트 삽입시 src파일을 현재 프로젝트로 복사합니다.
   */
  public async copyFile(fromAppID: number, toAppID: number, fileNames: string[]): Promise<void> {
    const serviceUrl = `/FileBehavior/copyFile?fromAppID=${fromAppID}&toAppID=${toAppID}`;
    await API.post(serviceUrl, fileNames);
  }

  //   /**
  //    * get All Custom Code Data by appID
  //    */
  //   public async getAllCustomCode(appID: number): Promise<ICustomCodeDTO[]> {
  //     const serviceUrl = `/UpdateContentBehavior/getAllCustomCodeDataDTO/?appID=${appID}`;
  //     const response = await API.get(serviceUrl);
  //     return response.data;
  //   }

  /**
   * 사용자의 코드와 메타데이터 입력을 통해 컴포넌트를 생성합니다.
   */
  @boundMethod
  public async addComponent(input: IAddComponentInput): Promise<number> {
    const response = await API.post<DTO<IAddComponentInput>>('/component/AddComponent', {
      dto: input,
    });

    const result: number = response.data;
    return result;
  }

  /**
   * Component DB에 등록된 ID, name을 조회합니다.
   */
  public async getDataStorePrimitiveTypeID(appID: number): Promise<IGetPrimitiveTypeInfo[]> {
    const response = await API.get(`/app/getPrimitiveTypeID/?appID=${appID}`);
    return response.data;
  }

  //   /**
  //    * sessionID를 통해 서버로 부터 unique한 Id return
  //    */
  //   @boundMethod
  //   public async getUniqueId(sessionId: string): Promise<SessionAndIdMessage> {
  //     const response = await API.get(`/document/uniqueId?sessionId=${sessionId}`);
  //     return response.data;
  //   }

  /**
   * 변수데이터 타입 reference 업데이트
   */
  @boundMethod
  public async updateVariableTypeRef(dtos: IUpdateVariableTypeRef[]): Promise<void> {
    const response = await API.put(`/dataStore/updateVariableTypeRef`, dtos);
  }

  @boundMethod
  private async getRegisteredFileInfos(appID: number): Promise<Array<IGetRegisteredFileInfosOutput>> {
    const response = await API.get(`/file/media?appID=${appID}`);
    return response.data;
  }
}

export default new AppRepository();
