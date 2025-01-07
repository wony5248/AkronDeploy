import DropdownComponent from 'components/controls/DropdownComponent';
import useEditorStore from 'hooks/useEditorStore';
import useFile from 'hooks/widget/useFile';
import { observer } from 'mobx-react-lite';
import { IPublishedComponentItem, LibraryType } from 'models/repository/AppRepository';
import WidgetRepository from 'models/repository/WidgetRepository';
import EditorStore from 'models/store/EditorStore';
import { useState } from 'react';
import {
  addLibraryButton,
  addLibraryText,
  addLibraryWrapper,
  toolPaneComponentButton,
  toolPaneComponentButtonImage,
  toolPaneComponentButtonLabel,
  toolPaneComponentButtonLabelWrapper,
  toolPaneComponentButtonWrapper,
  toolPaneComponentCategory,
  toolPaneComponentCategoryItems,
  toolPaneComponentCategoryTitle,
  toolPaneComponentTabPanel,
} from 'styles/toolpane/ComponentInsertToolpane';

/**
 * 라이브러리를 사용하기 위해 가공된 형태입니다.
 */
interface LibraryCategory {
  categoryId: string;
  categoryName: string;
  categoryItems: IPublishedComponentItem[];
}

/**
 * LibraryItem Props
 */
interface ILibraryItemProps {
  editorStore: EditorStore;
  componentItem: IPublishedComponentItem;
}

/**
 * 카테고리 정보를 저장한 배열의 형태입니다.
 */
interface CategoryList {
  categoryId: string;
  categoryName: string;
}

/**
 * LibraryItem Component
 */
const LibraryItem: React.FC<ILibraryItemProps> = ({ editorStore, componentItem }: ILibraryItemProps) => {
  const { createFileSrc } = useFile();
  const tooltipStore = editorStore.getTooltipStore();
  return (
    <div css={toolPaneComponentButton}>
      <div
        css={toolPaneComponentButtonWrapper(false, false)}
        onClick={async () => {
          // const lockedMessage = getLockMessage(editorStore);
          // if (lockedMessage) {
          //   editorStore.getEditorUIStore().setEditorSnackBarMsg(lockedMessage);
          //   return;
          // }
          // if (componentItem.primaryComponent && componentItem.appID) {
          //   const resourceList: Set<string> = new Set<string>();
          //   findUsedComponentResources(componentItem.primaryComponent, resourceList);
          //   await copyComponentResources(editorStore.getAppID(), componentItem.appID, resourceList);
          //   ribbonStore.onClickedRibbonButton(
          //     'UserCustomList',
          //     'CompositeComponent',
          //     componentItem.primaryComponent,
          //     componentItem.appID,
          //     componentItem.gxPageID
          //   );
          // }
        }}
        onDragStart={e => {
          e.dataTransfer.setData('widgetId', String(WidgetRepository.generateWidgetID()));
          e.dataTransfer.setData('widgetType', 'ComponentPage');
          e.dataTransfer.setData('primaryComponentID', String(componentItem.primaryComponent?.getID()));
          e.dataTransfer.setData('targetAppID', String(componentItem.appID));
          e.dataTransfer.setData('gxPageID', String(componentItem.gxPageID));
          e.dataTransfer.effectAllowed = 'copy';
        }}
        onMouseEnter={e => {
          tooltipStore.openTooltip(e, 'topCenter', {
            title: e.currentTarget.innerText,
          });
        }}
        draggable="true"
      >
        <div css={toolPaneComponentButtonImage}>
          {componentItem.thumbnailFileName ? (
            <img
              alt={`Published GX Component ${componentItem.componentName}`}
              src={`${createFileSrc(componentItem.thumbnailFileName, undefined, componentItem.appID)}`}
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
          ) : (
            // <ImageResourceComponent w="32px" h="32px" id={'IMG_GX_COMPONENT_DUMMY'} />
            <button style={{ width: '32px', height: '32px' }} />
          )}
        </div>
        <div css={toolPaneComponentButtonLabelWrapper}>
          <div css={toolPaneComponentButtonLabel}>{componentItem.componentName}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * LibraryCategory Props
 */
interface ILibraryCategoryProps {
  editorStore: EditorStore;
  searchValue: string;
  categoryName: string;
  componentItemList: IPublishedComponentItem[];
}

/**
 * LibraryCategory 컴포넌트
 */
const LibraryCategory: React.FC<ILibraryCategoryProps> = ({
  editorStore,
  searchValue,
  categoryName,
  componentItemList,
}: ILibraryCategoryProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <>
      {categoryName !== '' && (
        <div css={toolPaneComponentCategory}>
          {/* <ImageResourceButtonComponent
            id={'IC_TOOLPANE_TOGGLE_OFF'}
            pressedId={'IC_TOOLPANE_TOGGLE_ON'}
            w={'16px'}
            h={'16px'}
            onClick={() => setIsOpen(!isOpen)}
            pressed={isOpen}
            disabled={false}
            imagecss={toolPaneComponentCategoryButton}
          /> */}
          <button style={{ width: '16px', height: '16px' }} />
          <div css={toolPaneComponentCategoryTitle}>{categoryName}</div>
        </div>
      )}
      <div css={toolPaneComponentCategoryItems} style={{ display: isOpen ? 'flex' : 'none' }}>
        {componentItemList.map(item => {
          if (searchValue !== '') {
            if (
              !item.componentName
                .replace(/\n|\s/g, '')
                .toLowerCase()
                .includes(searchValue.replace(/\s/g, '').toLowerCase())
            ) {
              return null;
            }
          }
          return <LibraryItem key={item.primaryComponent?.getID()} editorStore={editorStore} componentItem={item} />;
        })}
      </div>
    </>
  );
};

/**
 * LibraryItemList props.
 */
interface ILibraryItemListProps {
  editorStore: EditorStore;
  searchValue: string;
  categoryList: CategoryList[];
  categoryInfo: LibraryCategory[];
}

/**
 * LibraryItemList 컴포넌트
 */
const LibraryItemList: React.FC<ILibraryItemListProps> = ({
  editorStore,
  searchValue,
  categoryList,
  categoryInfo,
}: ILibraryItemListProps) => {
  return (
    <div css={toolPaneComponentTabPanel}>
      {categoryList.map(category => {
        return (
          <LibraryCategory
            key={category.categoryId}
            searchValue={searchValue}
            categoryName={category.categoryName}
            editorStore={editorStore}
            componentItemList={
              categoryInfo.filter(libraryItem => libraryItem.categoryId === category.categoryId)[0].categoryItems
            }
          />
        );
      })}
    </div>
  );
};

/**
 * LibraryTabTopComponent props.
 */
interface ILibraryTabTopComponentProps {
  editorStore: EditorStore;
  libraryType: LibraryType;
  setLibraryType: (newValue: LibraryType) => void;
  onClickUpdate: () => void;
}
/**
 * LibraryTabTopComponent.
 */
const LibraryTabTopComponent = ({
  editorStore,
  libraryType,
  setLibraryType,
  onClickUpdate,
}: ILibraryTabTopComponentProps) => {
  return (
    <div style={{ fill: 'none', display: 'flex', padding: '4px 16px' }}>
      <DropdownComponent
        options={[
          { label: 'GX 컴포넌트', value: 'GXComponent' },
          { label: 'UX 컴포넌트', value: 'UXComponent' },
        ]}
        value={libraryType}
        onChange={setLibraryType}
      />

      <div style={{ flex: 1 }} />
      {/* <ImageResourceButtonComponent
        w={'24px'}
        h={'24px'}
        id={'L_TOOLPANE_CUSTOM_UPDATE_NORMAL'}
        hoverId={'L_TOOLPANE_CUSTOM_UPDATE_HOVER'}
        disabled={false}
        onClick={onClickUpdate}
      /> */}
      <button style={{ width: '24px', height: '24px' }} />
    </div>
  );
};

/**
 * LeftToolPaneLibraryTab props.
 */
interface IProps {
  searchValue: string;
  setAddLibraryDialogOpen: (value: boolean) => void;
}

/**
 * LeftToolPaneLibraryTab
 */
const LeftToolPaneLibraryTab: React.FC<IProps> = ({ searchValue, setAddLibraryDialogOpen }: IProps) => {
  const [libraryType, setLibraryType] = useState<LibraryType>('GXComponent');

  const editorStore = useEditorStore();
  // const registeredLibraryInfo = Array.from(editorStore.getRegisteredLibraryInfoMap()[libraryType])[0];
  const targetLibraryInfoData = undefined; // registeredLibraryInfo ? registeredLibraryInfo[1] : undefined;

  if (!targetLibraryInfoData) {
    return (
      <>
        <LibraryTabTopComponent
          editorStore={editorStore}
          libraryType={libraryType}
          setLibraryType={setLibraryType}
          onClickUpdate={() => setAddLibraryDialogOpen(true)}
        />
        <div css={addLibraryWrapper}>
          {/* <ImageResourceComponent id={'IMG_UPLOAD'} w={'112px'} h={'109px'} /> */}
          <button style={{ width: '112px', height: '109px' }} />
          <span css={addLibraryText}>{'Bring the UI Kit'}</span>
          <button
            type={'button'}
            value={'Add Library'}
            css={addLibraryButton}
            onClick={() => setAddLibraryDialogOpen(true)}
          >
            From GX/UX
          </button>
        </div>
      </>
    );
  }

  // TODO: 라이브러리 등록 및 사용에 대한 UI가 발행된 이후에 수정 필요
  // 자료구조 자체는 여러 개의 라이브러리를 등록할 수 있도록 구현하였으나
  // 현재는 하나의 라이브러리만 등록해서 사용하도록 구현
  // return registeredLibraryInfo.map(library => {
  const categoryList: CategoryList[] = [];
  const processLibrary = () => {
    const libraryCategory: LibraryCategory[] = [];
    // (JSON.parse(targetLibraryInfoData.categoryInfo) as PublishInfo[]).forEach(category => {
    //   const filteredComponentItemList: IPublishedComponentItem[] = [];
    //   category.pageList.forEach(componentId => {
    //     const filteredLibrary = targetLibraryInfoData.componentItemList.filter(
    //       componentItem => String(componentItem.primaryComponent?.getParent()?.getID()) === componentId
    //     )[0];
    //     filteredComponentItemList.push(filteredLibrary);
    //     if (!categoryList.some(el => el.categoryId === category.sectionId)) {
    //       categoryList.push({
    //         categoryId: category.sectionId,
    //         categoryName: category.sectionName,
    //       });
    //     }
    //   });
    //   libraryCategory.push({
    //     categoryId: category.sectionId,
    //     categoryName: category.sectionName,
    //     categoryItems: filteredComponentItemList.filter(item => item !== undefined),
    //   });
    // });

    return libraryCategory;
  };

  const categoryInfo = processLibrary();

  return (
    <>
      <LibraryTabTopComponent
        editorStore={editorStore}
        libraryType={libraryType}
        setLibraryType={setLibraryType}
        onClickUpdate={() => setAddLibraryDialogOpen(true)}
      />
      <LibraryItemList
        editorStore={editorStore}
        searchValue={searchValue}
        categoryList={categoryList}
        categoryInfo={categoryInfo}
      />
    </>
  );
};

export default observer(LeftToolPaneLibraryTab);
