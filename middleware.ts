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
  const res = NextResponse.next()
  if (!pathname.includes('.')) res.headers.set('Vary', 'Accept')
  return res
}

export const config = { matcher: ['/((?!(?:_next|img|video|api)(?:/|$)).*)'] }
