import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Router from 'Router';
import initializeResourceLoader from 'util/ResourceUtil';

initializeResourceLoader();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Router />
    </Suspense>
  </StrictMode>
);
