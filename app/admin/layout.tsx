import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Administrativo - SUED Governo",
  description: "Fichas técnicas para merenda escolar",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
