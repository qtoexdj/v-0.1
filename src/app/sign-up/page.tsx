'use client'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp 
        path="/sign-up"
        routing="path"
        redirectUrl="/developer"
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            card: "shadow-md rounded-lg"
          }
        }}
      />
    </div>
  )
}