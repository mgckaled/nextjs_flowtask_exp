import type { Metadata } from "next";
import { Space_Grotesk, Merriweather } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Header from "./components/shared/Header";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowTask - Gestão de Projetos Inteligente",
  description: "Plataforma completa para gestão de projetos e tarefas. Organize seu time, acompanhe o progresso e alcance seus objetivos com eficiência.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${merriweather.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
