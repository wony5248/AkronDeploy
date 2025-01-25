import ImageResourceButtonComponent from 'components/common/ImageResourceButtonComponent';
import ImageResourceComponent from 'components/common/ImageResourceComponent';
import LeftToolPaneMUITab from 'components/toolpane/LeftToolPaneMUITab';
import useEditorStore from 'hooks/useEditorStore';
import useFile from 'hooks/widget/useFile';
import { IPublishedComponentItem } from 'models/repository/AppRepository';
import WidgetRepository from 'models/repository/WidgetRepository';
import EditorStore from 'models/store/EditorStore';
import { useState } from 'react';
import {
  toolPaneComponentButton,
  toolPaneComponentButtonImage,
  toolPaneComponentButtonLabel,
  toolPaneComponentButtonLabelWrapper,
  toolPaneComponentButtonWrapper,
  toolPaneComponentCategory,
  toolPaneComponentCategoryButton,
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
 * LibraryItem Component
 */
const LibraryItem: React.FC<ILibraryItemProps> = ({ editorStore, componentItem }: ILibraryItemProps) => {
  const { createFileSrc } = useFile();
  const tooltipStore = editorStore.getTooltipStore();

  return (
    <div css={toolPaneComponentButton}>
      <div
        css={toolPaneComponentButtonWrapper(false, false)}
        onClick={() => {
          //   const lockedMessage = getLockMessage(editorStore);
          //   if (!lockedMessage) {
          //     ribbonStore.onClickedRibbonButton(
          //       'UserCustomList',
          //       'CompositeComponent',
          //       componentItem.primaryComponent,
          //       componentItem.appID,
          //       componentItem.gxPageID
          //     );
          //     return;
          //   }
          //   editorStore.getEditorUIStore().setEditorSnackBarMsg(lockedMessage);
        }}
        onDragStart={e => {
          e.dataTransfer.setData('widgetId', String(WidgetRepository.generateWidgetID()));
          e.dataTransfer.setData('widgetType', 'ComponentPage');
          e.dataTransfer.setData('primaryComponentID', String(componentItem.primaryComponent?.getID()));
          e.dataTransfer.setData('targetAppID', String(componentItem.appID));
          e.dataTransfer.effectAllowed = 'copy';
        }}
        draggable="true"
        onMouseEnter={e => {
          tooltipStore.openTooltip(e, 'topCenter', {
            title: e.currentTarget.innerText,
          });
        }}
      >
        <div css={toolPaneComponentButtonImage}>
          {componentItem.thumbnailFileName ? (
            <img
              alt={`Published GX Component ${componentItem.componentName}`}
              src={`${createFileSrc(componentItem.thumbnailFileName, undefined, componentItem.appID)}`}
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
          ) : (
            <ImageResourceComponent w="32px" h="32px" id={'IMG_GX_COMPONENT_DUMMY'} />
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
      {/* 카테고리 부분 */}
      {categoryName !== '' && (
        <div css={toolPaneComponentCategory}>
          <ImageResourceButtonComponent
            id={'IC_TOOLPANE_TOGGLE_OFF'}
            pressedId={'IC_TOOLPANE_TOGGLE_ON'}
            w={'16px'}
            h={'16px'}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            pressed={isOpen}
            disabled={false}
            imagecss={toolPaneComponentCategoryButton}
          />

          <div css={toolPaneComponentCategoryTitle}>{categoryName}</div>
        </div>
      )}
      {/* 카테고리 별 세부 컴포넌트 리스트 */}
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
  categoryNameList: string[];
  categoryInfo: LibraryCategory[];
}

/**
 * LibraryItemList 컴포넌트
 */
const LibraryItemList: React.FC<ILibraryItemListProps> = ({
  editorStore,
  searchValue,
  categoryNameList,
  categoryInfo,
}: ILibraryItemListProps) => {
  return (
    <>
      {categoryNameList.map(categoryName => {
        return (
          <LibraryCategory
            key={categoryName}
            searchValue={searchValue}
            categoryName={categoryName}
            editorStore={editorStore}
            componentItemList={
              categoryInfo.filter(libraryItem => libraryItem.categoryName === categoryName)[0].categoryItems
            }
          />
        );
      })}
    </>
  );
};

/**
 * LeftToolPaneBasicTab props.
 */
interface IProps {
  searchValue: string;
}

/**
 * LeftToolPaneBasicTab
 */
const LeftToolPaneBasicTab = ({ searchValue }: IProps) => {
  const editorStore = useEditorStore();

  const categoryList: string[] = [];

  return (
    <div css={toolPaneComponentTabPanel}>
      <LibraryItemList
        editorStore={editorStore}
        searchValue={searchValue}
        categoryNameList={[...new Set(categoryList)]}
        categoryInfo={[]}
      />
      <LeftToolPaneMUITab searchValue={searchValue} />
    </div>
  );
};

export default LeftToolPaneBasicTab;
