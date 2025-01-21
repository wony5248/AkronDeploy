import PageThumbnailComponent from 'components/toolpane/PageThumbnailComponent';
import PageModel from 'models/node/PageModel';
import { PageSection } from 'models/widget/WidgetPropTypes';
import { useEffect, useState } from 'react';

/**
 * Page를 담을 Item 입니다. 페이지 리스트를 render하기 위한 구조체입니다.
 */
export interface PageItem {
  id: number;
  content: PageModel;
  type: string;
}

/**
 * 구역을 담을 Item 입니다. 하위에 pageItem을 리스트로 들고 있을 수 있습니다.
 */
export interface SectionItem {
  id: number;
  content: PageSection;
  type: string;
  children: PageItem[];
}

/**
 * PageListComponent props.
 */
interface IProps {
  pageList: PageItem[];
}

const PageListComponent: React.FC<IProps> = ({ pageList }: IProps) => {
  const [list, setList] = useState<PageItem[]>(pageList);
  useEffect(() => {
    setList(pageList);
  }, [pageList]);

  return (
    <>
      {list.map(item => (
        <PageThumbnailComponent key={item.id} pageModel={item.content} sectionSelected={false} idx={item.id} />
      ))}
    </>
  );
};

export default PageListComponent;
