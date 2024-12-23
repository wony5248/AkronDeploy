import { css } from '@emotion/react';

// 기본 폰트 스타일 (산세리프)
export const defaultFont = css`
  font-family: 'SpoqaHanSansNeo', sans-serif;
`;

// 페이지 크기를 지정해주는 스타일
export const page = css`
  ${defaultFont};
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f4f4;
`;

// 하얀 바탕의 직사각형 박스
export const box = css`
  background-color: #ffffff;
`;

// 둥근 border와 그림자를 가지고 있는 박스
export const shadowBox = css`
  ${box};
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 2px 2px #4d4d4d;
`;

// 외부 UI 라이브러리가 전역 CSS를 설정하여 studio 내부 UI가 깨지는 경우, 기본값으로 되돌리기 위한 스타일
export const cancelReset = css`
  * {
    box-sizing: content-box;

    &::before,
    &::after {
      box-sizing: content-box;
    }
  }
`;
