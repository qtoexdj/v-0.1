import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Definir las rutas que deben ser protegidas
    '/((?!_next|.*\\..*|favicon.ico).*)',
  ],
};
