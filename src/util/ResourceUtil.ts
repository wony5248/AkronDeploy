import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import i18nHTTPBackend from 'i18next-http-backend';
import i18nBrowserLanguageDetector from 'i18next-browser-languagedetector';

/**
 * SuperOffice 및 SuperUX에서는 리소스 로딩을 위해 i18next 라이브러리를 사용합니다.
 * 리소스 맵(리소스 id와 텍스트 or 이미지로 이루어진 json 파일들)을 어떻게 로딩할지 설정합니다.
 *
 * json 파일 로딩
 * - json 파일 로딩은 i18next-http-backend가 담당합니다.
 * - "public/locales/언어/네임스페이스.json" 경로들을 읽어 리소스 맵을 로딩합니다.
 * - ex. 한국어 텍스트 리소스: public/locales/ko/studio.json
 *
 * 언어 설정
 * - i18next-browser-languagedetector 라이브러리가 브라우저의 언어를 감지하여 언어를 세팅해줍니다.
 * - 여러 언어에 대하여 리소스가 정상적으로 표시되는지 확인하고 싶으면,
 *   브라우저 디버거 콘솔에서 아래와 같이 입력하고 페이지를 새로고침하면 됩니다.
 *
 * ```typescript
 * // ex. 한국어 테스트.
 * localStorage.i18nextLng = 'ko';
 *
 * // ex. 영어 테스트.
 * localStorage.i18nextLng = 'en';
 * ```
 */
export default function initializeResourceLoader() {
  i18n
    // HTTP를 사용하여 translation 로딩.
    .use(i18nHTTPBackend)
    // // 브라우저의 언어를 감지합니다.
    .use(i18nBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
      react: {
        useSuspense: true,
      },
      // 기본 언어.
      lng: 'ko',
      fallbackLng: 'ko',
      debug: true,
      // keySeparator: false,
      // react-i18next 문서에 따르면 React는 이미 XSS-safe하므로 이 옵션을 넣으라고 함.
      // https://react.i18next.com/getting-started#basic-sample
      interpolation: {
        escapeValue: false,
      },
      // 네임스페이스 설정. (네임스페이스.json 파일들을 불러오게 됩니다.)
      // ns만 설정하면 useTranslation()에 네임스페이스를 인수로 주지 않는 한 (ex. useTranslation('cm_img')) studio.json에서만 리소스를 찾습니다.
      // fallbackNS도 ns랑 동일하게 설정해주면, useTranslation()을 인수 없이 호출해도 알아서 리소스를 잘 찾아옵니다.
      ns: ['akron_image'],
      fallbackNS: ['akron_image'],
      backend: {
        // i18next-http-backend의 리소스 파일 탐색 경로를 override합니다.
        // (https://github.com/i18next/i18next-http-backend에서 backend options 부분 참고)
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });
}
