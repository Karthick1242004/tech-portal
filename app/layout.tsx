'use client';

import React from "react"
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppHeader } from '@/components/layout/AppHeader'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>Technician Portal - Enterprise Access</title>
        <meta name="description" content="Secure technician portal for job management and feedback" />
      </head>
      <body className="font-sans antialiased">
        <AppHeader />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
