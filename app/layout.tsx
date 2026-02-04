import React from "react"
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppHeader } from '@/components/layout/AppHeader'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: 'Technician Portal - Enterprise Access',
  description: 'Secure technician portal for job management and feedback',
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppHeader />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
