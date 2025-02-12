import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainPageComponent from 'components/pages/ProjectEditPage';
import ErrorComponent from 'components/common/ErrorComponent';

/**
 * 프로젝트 라우팅을 정의한 라우터 컴포넌트입니다.
 */
const Router = (): JSX.Element => {
  return (
    <Suspense fallback={<ErrorComponent />}>
      <BrowserRouter>
        <Routes>
          <Route path="/edit/:appId" element={<MainPageComponent />}></Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

Router.displayName = 'Router';

export default Router;
