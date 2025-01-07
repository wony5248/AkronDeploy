import { isNotNull, isUndefined } from '@akron/runner';
import useEditorStore from 'hooks/useEditorStore';
import API from 'models/API/API';

/**
 * useFile() hook이 가져야 하는 타입.
 * 에디터, 런타임 모두 이 타입에 맞춰 구현합니다.
 */
export type UseFileHook = () => {
  // src에 사용할 문자열을 만들어 줌.
  createFileSrc: (fileName?: string, contentType?: string, appID?: number) => string;
};

/**
 * 이미지, 비디오 등 파일들을 다루기 위한 hook입니다.
 * 편집, 실행 등 상황에 따라 각 도구의 구현이 달라질 수 있습니다.
 * 여기서는 서버에서 파일 데이터를 받아옵니다.
 */
const useFile: UseFileHook = () => {
  const editorStore = useEditorStore();

  return {
    createFileSrc: (fileName?: string, contentType?: string, appID?: number) => {
      if (isUndefined(fileName)) {
        return '';
      }

      const appIDParam = appID ?? editorStore.getAppID();

      // URL 형식인 경우 -> 그대로 사용.
      if (isNotNull(fileName?.match(/^\s*http/))) {
        return fileName as string;
      }

      // 특수문자 들어가는 경우 때문에 인코딩 필수.
      // 확인 결과 content type 지정하기 애매할 때 octet-stream으로 때워도 이미지, 비디오 등 잘 띄워주긴 함. 따라서 미지정 시의 기본값으로 설정.
      const contentTypeParam = encodeURIComponent(contentType ?? 'application/octet-stream');

      if (contentType?.startsWith('video')) {
        return `${API.getBaseUrl()}/FileBehavior/video?appID=${appIDParam}&contentType=${contentTypeParam}&fileName=${encodeURIComponent(
          fileName as string | number | boolean
        )}`;
      }
      return `${API.getBaseUrl()}/FileBehavior/file?appID=${appIDParam}&contentType=${contentTypeParam}&fileName=${encodeURIComponent(
        fileName as string | number | boolean
      )}`;
    },
  };
};

export default useFile;
