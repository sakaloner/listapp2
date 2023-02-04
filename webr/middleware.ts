// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const cookie = request.cookies.get('token')
//   if (!cookie) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/state/:path*','/regions/:path*', '/wars', '/war:path*', '/home', '/myprofile', '/profile/:path*', '/profile/:path*']
// }
