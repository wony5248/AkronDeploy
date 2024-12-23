import { saveLoading } from 'styles/ribbon-menu/SaveIndicator';

/**
 * 저장 로딩 페이지 Component
 */
const SaveLoading: React.FC = () => {
  return (
    <div css={saveLoading}>
      <img src={'' /*icLoading*/} alt="Loading" width={'40px'} height={'40px'} />
    </div>
  );
};

export default SaveLoading;
