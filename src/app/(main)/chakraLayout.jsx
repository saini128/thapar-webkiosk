'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { DashboardProvider } from '@/context/dashboardContext';
import { Sidebar } from '@/components/Sidebar';
import { Flex } from '@chakra-ui/react';
import '@/app/chakra.css';

export default function ChakraLayout({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <DashboardProvider>
        <Flex
          h={[null, null, '100vh']}
          maxW="2000px"
          flexDir={['column', 'column', 'row']}
          overflow="hidden"
        >
          <Sidebar />
          <Flex overflowY="auto">{children}</Flex>
        </Flex>
      </DashboardProvider>
    </ChakraProvider>
  );
}
