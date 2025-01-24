'use client'
import { SignIn } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-gray-800">Bolt.Diy SaaS</h1>
      
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            card: "shadow-md rounded-lg"
          }
        }}
        path="/"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/developer"
      />
    </div>
  )
}
