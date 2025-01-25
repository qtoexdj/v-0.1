'use client'
import { SignIn, UserButton } from '@clerk/nextjs'
import React from 'react'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <SignIn
          routing="virtual"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              card: "shadow-lg rounded-xl p-6 bg-white w-full"
            },
            variables: {
              colorPrimary: "#2563eb",
              colorText: "#1f2937",
              colorTextSecondary: "#4b5563",
              fontFamily: "Inter"
            },
            layout: {
              socialButtonsPlacement: "bottom"
            }
          }}
        />
      </div>
    </div>
  )
}
