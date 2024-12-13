import type { Metadata } from "next";
import { Nunito, Raleway } from "next/font/google";
import "./globals.css";

const poppins = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SUED Governo - Ficha Técnica",
  description: "Fichas técnicas para merenda escolar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
