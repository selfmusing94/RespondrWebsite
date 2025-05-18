import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Respondr",
  description: "Emergency Rescue Platform",
};

export default function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}