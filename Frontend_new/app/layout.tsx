import './globals.css'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

export const metadata = {
  title: '智能财富管理 - 预算优化与投资增长',
  description: '专业的个人财富管理平台，帮助您实时追踪、分析和优化个人收支与投资组合，提供个性化建议。',
  keywords: '财富管理,预算规划,投资组合,储蓄目标,金融分析',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script 
          src="https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans">
        <div className="min-h-screen bg-gray-50">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
        <Script id="coze-init" strategy="afterInteractive">
          {`
            new CozeWebSDK.WebChatClient({
              config: {
                bot_id: '7532344176487350279',
              },
              componentProps: {
                title: 'Coze',
              },
              auth: {
                type: 'token',
                token: 'pat_vXXIzRbqwvbBuI6ku5ZOHTFrzk4LRjAKZjcOBM0uJ24k50KLX8yAWapp6eumBU1o',
                onRefreshToken: function () {
                  return 'pat_vXXIzRbqwvbBuI6ku5ZOHTFrzk4LRjAKZjcOBM0uJ24k50KLX8yAWapp6eumBU1o'
                }
              }
            });
          `}
        </Script>
      </body>
    </html>
  )
} 