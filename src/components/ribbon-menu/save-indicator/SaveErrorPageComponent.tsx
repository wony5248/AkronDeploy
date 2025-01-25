import ImageResourceComponent from 'components/common/ImageResourceComponent';
import {
  saveErrorPage,
  saveErrorPageButton,
  saveErrorPageText,
  saveErrorPageTitle,
} from 'styles/ribbon-menu/SaveIndicator';

/**
 * 재저장 실패 페이지 component
 */
const SaveErrorPageComponent: React.FC = () => {
  return (
    <div css={saveErrorPage}>
      <ImageResourceComponent id={'IMG_ERROR'} w={'80px'} h={'80px'} />
      <div css={saveErrorPageTitle}>알 수 없는 오류가 발생했습니다.</div>
      <div css={saveErrorPageText}>새로고침을 하거나, 잠시 후 다시 접속해 주시기 바랍니다.</div>
      <div
        css={[saveErrorPageButton, 'forReload']}
        onClick={() => {
          window.location.reload();
        }}
      >
        다시 시도
      </div>
      <div
        css={[saveErrorPageButton, 'forLanding']}
        onClick={() => {
          // closeCurrentWindow();
          // openLandingPage();
        }}
      >
        돌아가기
      </div>
    </div>
  );
};

export default SaveErrorPageComponent;
