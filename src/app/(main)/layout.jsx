import ClientOnlyChakra from './ClientOnlyChakra';

export default function MainLayout({ children }) {
  return <ClientOnlyChakra>{children}</ClientOnlyChakra>;
}
