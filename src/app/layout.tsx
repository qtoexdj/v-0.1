import { ClerkProvider } from '@clerk/nextjs'
    import './globals.css'

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return (
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
          afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
          afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
        >
          <html lang="es">
            <body>
              <main>{children}</main>
            </body>
          </html>
        </ClerkProvider>
      )
    }
