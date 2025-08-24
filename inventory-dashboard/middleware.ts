import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'auth'

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const isRoot = pathname === '/'
  const isApi = pathname.startsWith('/api')
  const isStatic = pathname.startsWith('/_next') || pathname === '/favicon.ico'

  if (isStatic || isApi) return NextResponse.next()

  const hasAuth = req.cookies.has(AUTH_COOKIE)

  // If authenticated and trying to access login page, send to default app page
  if (hasAuth && isRoot) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // If not authenticated and trying to access any protected route, redirect to login
  if (!hasAuth && !isRoot) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    const from = pathname + (search || '')
    url.search = from ? `?from=${encodeURIComponent(from)}` : ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
