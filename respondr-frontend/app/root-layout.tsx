import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Respondr',
  description: 'AI-powered emergency response platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}