import useEditorStore from 'hooks/useEditorStore';
import { ReactNode, useRef } from 'react';
import { CenterStyleWrapper } from 'styles/editor/EditorStyle';

/**
 * PageWrapperComponent props.
 */
interface IProps {
  children: ReactNode;
}

/**
 * PageWidgetComponent용 Wrapper
 */
const CenterStyleWrapperComponent: React.FC<IProps> = ({ children }: IProps) => {
  const editorStore = useEditorStore();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      css={CenterStyleWrapper}
      onScroll={() => {
        // first child element가 모드마다 page 역할을 하는 컴포넌트임.
        const pageBoundingClientRect = ref?.current?.firstElementChild?.getBoundingClientRect();
        if (pageBoundingClientRect) {
          editorStore.setEditingPageRefPosition(
            pageBoundingClientRect.x,
            pageBoundingClientRect.y,
            pageBoundingClientRect.width,
            pageBoundingClientRect.height
          );
        }
      }}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default CenterStyleWrapperComponent;
