import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://quizlett-mcqs.vercel.app"),
  title: "Quizlett — Test Your Knowledge",
  description:
    "A polished, local-first interactive quiz across Mathematics, Programming, and General Knowledge — 45 questions, selectable length and difficulty, attempt history, and achievements.",
  applicationName: "Quizlett",
  keywords: ["quiz", "mcq", "mathematics", "programming", "general knowledge", "practice"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Quizlett — Test Your Knowledge",
    description:
      "A polished, local-first interactive quiz across Mathematics, Programming, and General Knowledge.",
    siteName: "Quizlett",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizlett — Test Your Knowledge",
    description:
      "A polished, local-first interactive quiz across Mathematics, Programming, and General Knowledge.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070A12" },
    { media: "(prefers-color-scheme: light)", color: "#F4F6FB" },
  ],
}

// apply the persisted theme before first paint to avoid a flash of the wrong theme
const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light")}catch(e){document.documentElement.classList.add("dark")}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
