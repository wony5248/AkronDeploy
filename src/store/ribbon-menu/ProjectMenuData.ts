import { IRibbonButton } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * Project Menu Data
 */
const ProjectMenuData: IRibbonButton = {
  type: 'dropdown',
  label: '프로젝트',
  image: 'IC_MENU_PROJECT',
  childList: [
    {
      id: 'RIB_FILE_RENAME_FILE',
      label: '프로젝트 이름 바꾸기',
      type: 'DialogMenuItem',
      image: 'IC_PROJECT_RENAME',
      commandPropName: 'RenameFile',
      commandType: 'File',
    },
    {
      id: 'TOP_MENU_PROJECT_SEPARATOR1',
      type: 'SeparatorItem',
    },
    // {
    //   id: 'RIB_FILE_FILE_ADD',
    //   label: '새 프로젝트 생성',
    //   type: 'DialogMenuItem',
    //   image: 'IC_PROJECT_NEWPROJECT',
    //   commandPropName: 'AddFile',
    //   commandType: 'File',
    // },
    {
      id: 'RIB_FILE_FILE_OPEN',
      label: '프로젝트 불러오기',
      type: 'DialogMenuItem',
      image: 'IC_PROJECT_LOADPROJECT',
      commandPropName: 'OpenFile',
      commandType: 'File',
    },
    {
      id: 'RIB_FILE_FILE_SAVE_AS',
      label: '다른 이름으로 저장',
      type: 'DialogMenuItem',
      image: 'IC_PROJECT_DUPLICATE',
      commandPropName: 'SaveFileAs',
      commandType: 'File',
    },
    // {
    //     id: 'RIB_FILE_FILE_SAVE_AS',
    //     label: '템플릿으로 저장',
    //     type: 'DialogMenuItem',
    //     image: 'IC_PROJECT_SAVETEMPLATE',
    //     commandPropName: 'SaveFileAs',
    //     commandType: 'File',
    // },
    // {
    //   id: 'TOP_MENU_PROJECT_SEPARATOR2',
    //   type: 'SeparatorItem',
    // },
    // {
    //   id: 'RIB_FILE_CREATE_UX_COMPONENT',
    //   label: 'UX 컴포넌트 저장',
    //   type: 'DialogMenuItem',
    //   image: 'IC_PROJECT_SAVETEMPLATE',
    //   commandPropName: 'PublishUXComponent',
    //   commandType: 'File',
    // },
    // {
    //   id: 'TOP_MENU_PROJECT_SEPARATOR3',
    //   type: 'SeparatorItem',
    // },
    // {
    //   id: 'RIB_FILE_CREATE_UX_TEMPLATE',
    //   label: 'UX 템플릿 저장',
    //   type: 'DialogMenuItem',
    //   image: 'IC_PROJECT_SAVETEMPLATE',
    //   commandPropName: 'PublishUXTemplate',
    //   commandType: 'File',
    // },
    // {
    //   id: 'TOP_MENU_PROJECT_SEPARATOR4',
    //   type: 'SeparatorItem',
    // },
    // {
    //   id: 'RIB_FILE_CSS_IMPORT',
    //   label: 'CSS 파일 불러오기',
    //   type: 'DialogMenuItem',
    //   image: 'IC_CSS_CSSLOAD',
    //   commandPropName: 'fileImportDialog',
    //   commandType: 'File',
    // },
    // {
    //   id: 'RIB_FILE_CSS_CODEMANAGE',
    //   label: 'CSS 코드 파일 관리',
    //   type: 'DialogMenuItem',
    //   image: 'IC_CSS_CSSLOAD',
    //   commandPropName: 'fileListDialog',
    //   commandType: 'File',
    // },
    // {
    //   id: 'TOP_MENU_PROJECT_SEPARATOR5',
    //   type: 'SeparatorItem',
    // },
    // {
    //   id: 'RIB_FILE_CLOSE_APP',
    //   label: '프로젝트 닫기',
    //   type: 'NormalMenuItem',
    //   image: 'IC_PROJECT_CLOSE',
    //   commandPropName: 'CloseApp',
    //   commandType: 'File',
    // },
  ],
};

export default ProjectMenuData;
