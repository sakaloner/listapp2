// // middleware.ts
// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const cookie = request.cookies.get('Authorization')
//   console.log('cookie', cookie)
//   if(!cookie){
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
//   if (request.url.split('/')[3] === 'login'){
//     return
//   }
// }

// export const config = {
//   matcher: ['/','/:path*','/categories', ':path*']
// }