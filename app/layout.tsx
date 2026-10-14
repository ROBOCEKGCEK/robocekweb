import type { Metadata } from "next";
import { Space_Grotesk, Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://robocekgcek.in"),
  title: "ROBOCEK GCEK — Robotics & Autonomous Systems Club",
  description: "ROBOCEK is the premier robotics club at Government College of Engineering Kannur. Building autonomous, embedded, swarm, and competitive robotic systems.",
  icons: {
    icon: "/logo_black.png",
    apple: "/logo_black.png",
  },
  openGraph: {
    title: "ROBOCEK GCEK — Robotics Club",
    description: "ROBOCEK — The Official Robotics Club of Government College of Engineering Kannur.",
    url: "https://robocekgcek.in",
    siteName: "ROBOCEK GCEK",
    images: [
      {
        url: "/logo_black.png",
        width: 1200,
        height: 630,
        alt: "ROBOCEK GCEK Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROBOCEK GCEK",
    description: "ROBOCEK — The Official Robotics Club of Government College of Engineering Kannur.",
    images: ["/logo_black.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`h-full antialiased ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">{children}</body>
    </html>
  );
}
