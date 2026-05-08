// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // getUser() lebih lambat tapi jauh lebih aman buat server-side guard
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const { pathname } = url

  // --- LOGIKA ANTI PING-PONG ---

  // 1. Kalo user BELUM login dan maksa masuk area dashboard
  if (!user && pathname.startsWith('/dashboard')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Kalo user SUDAH login tapi iseng buka page login/register
  if (user && (pathname === '/login' || pathname === '/register')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

// MATCHER: Jangan pake regex yang ribet, sebutin aja yang mau dijaga
export const config = {
  matcher: [
    '/dashboard/:path*', // Jagain semua yang di dalem folder dashboard
    '/login',            // Cek rute login
    '/register',         // Cek rute register
  ],
}