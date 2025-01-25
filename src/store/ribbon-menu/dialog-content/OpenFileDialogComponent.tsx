import ImageResourceComponent from 'components/common/ImageResourceComponent';
import DialogComponent from 'components/controls/dialog/DialogComponent';
import useEditorStore from 'hooks/useEditorStore';
import { IAppItem } from 'models/repository/AppRepository';
import EditorStore from 'models/store/EditorStore';
import { useEffect, useState } from 'react';
import { IDialogContentProps } from 'store/ribbon-menu/RibbonCommonTypes';
import {
  appName,
  openFileDialogLibraryItem,
  openFileDialogLibraryList,
  openFileDialogLibraryListWrapper,
  openFileDialogSearchBar,
  openFileDialogSearchBarInput,
  openFileDialogTimeStamp,
} from 'styles/ribbon-menu/dialog-content/OpenFileDialog';
import { getTimeAgo } from 'util/TimeUtil';

// 임시 선언. window.ts에 있던 파일
export interface AppProps {
  appName?: string;
  appID?: number;
  userID?: number;
  timestamp?: string;
}

/**
 * IAppItemListProps props
 */
interface IAppItemListProps {
  onClick: (value: AppProps) => void;
  editorStore: EditorStore;
  searchValue: string;
  appInfo: AppProps;
}

const isValidSearchValue = (text: string, searchValue: string) => {
  return (
    !searchValue || text.replace(/\n|\s/g, '').toLowerCase().includes(searchValue.replace(/\n|\s/g, '').toLowerCase())
  );
};

/**
 * 검색어, 문자열, 하이라이트 컬러를 입력받아 문자열에서 검색어와 일치하는 부분을 하이라이트 처리하여 보여줍니다.
 */
export const highlightSearchValue = (text: string, searchValue: string) => {
  if (!searchValue || !isValidSearchValue(text, searchValue)) {
    return <span css={appName}>{text}</span>;
  }

  const index = text.replace(/\n|\s/g, '').toLowerCase().indexOf(searchValue.replace(/\n|\s/g, '').toLowerCase());
  const start = text.substring(0, index);
  const middle = text.substring(index, index + searchValue.length);
  const end = text.substring(index + searchValue.length);
  const color = '#8C46FF';

  return (
    <span css={appName}>
      {start}
      <span style={{ color }}>{middle}</span>
      {end}
    </span>
  );
};

/**
 * AppItem을 타입에 따라 보여주는 컴포넌트입니다.
 */
const AppItemList: React.FC<IAppItemListProps> = ({
  onClick,
  editorStore,
  searchValue,
  appInfo,
}: IAppItemListProps) => {
  const [appItemList, setAppItemList] = useState<IAppItem[]>([]);

  useEffect(() => {
    // appList 가져오는 api
    // AppRepository.getRoomsApps(roomIDs, userId).then(app => {
    //     setAppItemList(app);
    // });
    const appModel = editorStore.getAppModel();
    const appItem: IAppItem = {
      appID: appModel?.getID() ?? 1,
      appName: appModel?.getName() ?? '',
    };
    setAppItemList([appItem]);
  }, [editorStore]);

  return (
    <ul css={openFileDialogLibraryList}>
      {appItemList.map(appItem => {
        const { appName, appID, userID, timestamp } = appItem;

        if (!isValidSearchValue(appName, searchValue)) {
          return null;
        }

        return (
          <li key={appID}>
            <button
              type={'button'}
              css={openFileDialogLibraryItem(appID === appInfo.appID)}
              onClick={() =>
                onClick({
                  appName,
                  appID,
                  userID,
                })
              }
            >
              {highlightSearchValue(appName, searchValue)}
              <span css={openFileDialogTimeStamp}>{getTimeAgo(timestamp)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const RibbonOpenFileDialogContentComponent: React.FC<IDialogContentProps> = ({
  handleClose,
  open,
}: IDialogContentProps) => {
  const editorStore = useEditorStore();
  const [appInfo, setAppInfo] = useState<AppProps>({} as AppProps);
  const [searchValue, setSearchValue] = useState<string>('');

  const onClickOK = () => {
    // openMainPage(appInfo);
    handleClose();
  };

  return (
    <DialogComponent
      open={open}
      onClose={{ handler: handleClose }}
      title="프로젝트 불러오기"
      bottomProps={{
        primaryButtonHandler: onClickOK,
      }}
    >
      <div css={openFileDialogSearchBar}>
        <ImageResourceComponent id={'IC_TOOLPANE_SEARCH'} w={'28px'} h={'28px'} />
        <input
          css={openFileDialogSearchBarInput}
          type={'text'}
          placeholder={`Search your akron File`}
          onChange={e => setSearchValue(e.target.value)}
          onMouseDown={e => setAppInfo({} as AppProps)}
        />
      </div>
      <div css={openFileDialogLibraryListWrapper}>
        <AppItemList onClick={setAppInfo} editorStore={editorStore} searchValue={searchValue} appInfo={appInfo} />
      </div>
    </DialogComponent>
  );
};

export default RibbonOpenFileDialogContentComponent;
