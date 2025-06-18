'use client';

import { ChakraProvider, Flex , defaultSystem} from '@chakra-ui/react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardProvider } from '@/context/dashboardContext';
import '@/app/chakra.css';
export default function MainLayout({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <DashboardProvider>
        <Flex
            h={[null, null, "100vh"]}
            maxW="2000px"
            flexDir={["column", "column", "row"]}
            overflow="hidden"
        >
          <Sidebar />
          <Flex overflowY="auto">
            {children}
          </Flex>
        </Flex>
      </DashboardProvider>
    </ChakraProvider>
  );
}
