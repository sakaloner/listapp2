// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  const cookie = request.cookies.get('Authorization')
  if(!cookie){
    return NextResponse.redirect(new URL('/login', request.url))
  }
  console.log(request.url.split('/')[3])
  // if (request.url.split('/')[3] === 'login'){
  //   return
  // }
}

export const config = {
  matcher: ['/', '/profile', '/categories','/archive']
}



// This function can be marked `async` if using `await` inside
