import * as JSZip from 'jszip';
import AppRepository from 'models/repository/AppRepository';

class BuildRepository {
  public async getAppFile(appId: number, appName: string) {
    const appFile = await this.createAppFile(appId);
    if (appFile) {
      this.downloadAppFile(appFile, appName);
    } else {
      // TODO: 다이얼로그라도 띄우기
    }
  }

  private async createAppFile(appId: number) {
    try {
      const zipUrl = '/dist.zip';
      const response = await fetch(zipUrl);
      const zipBlob = await response.blob();

      const zip = await JSZip.loadAsync(zipBlob);

      const appContents = await AppRepository.getAppJson(appId);
      zip.file('assets/app.json', JSON.stringify(appContents));

      return await zip.generateAsync({ type: 'blob' });
    } catch (error) {
      console.error('ZIP 파일 처리 중 오류 발생:', error);
    }
  }

  private downloadAppFile(appFile: Blob, appName: string) {
    const blobURL = window.URL.createObjectURL(appFile);
    const link = document.createElement('a');

    link.href = blobURL;
    link.download = appName;
    link.click();
  }
}

export default new BuildRepository();
