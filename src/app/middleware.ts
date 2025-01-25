import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = createRouteMatcher([
  '/admin/(.*)',
  '/jefe/(.*)',
  '/member/(.*)'
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // 1. Protección de rutas
  if (protectedRoutes(req)) {
    await auth.protect({
      unauthorizedUrl: '/auth/unauthorized',
      unauthenticatedUrl: '/auth/sign-in'
    });
  }

  // 2. Redirección inteligente por roles
  const authObject = await auth();
  const { userId, sessionClaims } = authObject;
  const currentPath = req.nextUrl.pathname;

  if (userId) {
    const role = (sessionClaims?.publicMetadata as { rol?: string })?.rol || 'member';
    const basePath = `/${role}/dashboard`;

    // Evitar redirección infinita
    if (!currentPath.startsWith(basePath) && !currentPath.includes('/api')) {
      return NextResponse.redirect(new URL(basePath, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
