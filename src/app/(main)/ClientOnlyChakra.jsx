'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import ChakraLayout without SSR
const ChakraLayout = dynamic(() => import('./chakraLayout'), {
  ssr: false,
});

export default function ClientOnlyChakra({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // prevent mismatch by rendering only on client
  }, []);

  if (!mounted) return null;

  return <ChakraLayout>{children}</ChakraLayout>;
}
