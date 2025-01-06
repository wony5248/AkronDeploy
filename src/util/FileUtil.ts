import WidgetModel from 'models/node/WidgetModel';

/**
 * 앱에서 사용하는 파일들의 목록을 서버에 저장하기 위해 사용하는 데이터입니다.
 */
export interface FileInfo {
  appID: number;
  targetWidgetModel: WidgetModel;
  fileName: string;
  originalFileName: string;
  contentType: string;
}
