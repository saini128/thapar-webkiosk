'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/lib/emotion-cache';
import { DashboardProvider } from '@/context/dashboardContext';

const emotionCache = createEmotionCache();

export function Providers({ children }) {
  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider>
        <DashboardProvider>{children}</DashboardProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
