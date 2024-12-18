import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SalesProvider } from '@/contexts/SalesContext'
import { ManagementProvider } from '@/contexts/ManagementContext'
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Salon Management System',
  description: 'A comprehensive salon management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ManagementProvider>
            <SalesProvider>
              <ToastProvider>
                <main>{children}</main>
                <Toaster />
              </ToastProvider>
            </SalesProvider>
          </ManagementProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

