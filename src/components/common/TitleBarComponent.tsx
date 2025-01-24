import { ReactNode } from 'react';
import { controls, home, titleBar, children as childrenStyle, control } from 'styles/common/TitleBar';
// import styles from 'ux/style/common/TitleBar.scss';

/**
 * TitleBarComponent props.
 */
interface IProps {
  // 닫기 버튼 클릭 시의 행동. (기본값: 현재 창만 닫기)
  onClose?: () => void;
  children: ReactNode;
}

/**
 * 각 페이지의 위쪽에 존재하는 제목 표시줄을 나타냅니다.
 * children이 제목 표시줄 중간쯤에 넣어집니다.
 */
const TitleBarComponent: React.FC<IProps> = ({
  onClose = () => {
    // closeCurrentWindow();
  },
  children,
}: IProps) => {
  return (
    <div css={titleBar}>
      <div
        css={home}
        onClick={() => {
          // openLandingPage();
        }}
      >
        {/* <ImageResourceComponent id="IC_HOME_NORMAL" w={'40px'} h={'38px'} /> */}
        <button style={{ width: '40px', height: '38px' }} />
      </div>
      <div css={childrenStyle}>{children}</div>
      {/* <div css={controls}>
        <div
          css={control}
          onClick={() => {
            // minimizeCurrentWindow();
          }}
        >
          <ImageResourceComponent id="IC_MINIMIZATION_NORMAL" w={'16px'} h={'16px'} />
          <button style={{ width: '16px', height: '16px' }} />
        </div>
        <div
          css={control}
          onClick={() => {
            // toggleMaximizeCurrentWindow();
          }}
        >
          <ImageResourceComponent id="IC_MAXIMIZE_NORMAL" w={'16px'} h={'16px'} />
          <button style={{ width: '16px', height: '16px' }} />
        </div>
        <div css={control} onClick={onClose}>
          <ImageResourceComponent id="IC_CLOSE_NORMAL" w={'16px'} h={'16px'} />
          <button style={{ width: '16px', height: '16px' }} />
        </div>
      </div> */}
    </div>
  );
};

export default TitleBarComponent;
