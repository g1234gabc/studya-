import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, LoadingOverlay } from '@mantine/core';
import App from './App.tsx';
import './i18n';
import './index.css';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <Suspense fallback={<LoadingOverlay visible={true} />}>
        <App />
      </Suspense>
    </MantineProvider>
  </React.StrictMode>,
)
