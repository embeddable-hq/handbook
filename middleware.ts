import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const accept = req.headers.get('accept') || ''
  const { pathname } = req.nextUrl
  if (accept.includes('text/markdown') && !pathname.includes('.')) {
    const url = req.nextUrl.clone()
    url.pathname = (pathname === '/' ? '/index' : pathname.replace(/\/$/, '')) + '.md'
    const res = NextResponse.rewrite(url)
    res.headers.set('Vary', 'Accept')
    return res
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next|img|video|api).*)'] }
