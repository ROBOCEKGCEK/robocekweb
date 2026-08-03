import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://robocekgcek.in"),
  title: "ROBOCEK GCEK",
  description: "ROBOCEK — The Official Robotics Club of Government College of Engineering Kannur. Explore robotics, innovation, and technology.",
  icons: {
    icon: "/logo_black.png",
    apple: "/logo_black.png",
  },
  openGraph: {
    title: "ROBOCEK GCEK",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

