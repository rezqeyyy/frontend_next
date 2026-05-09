// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    console.log("SATPAM KERJA: Ngecek path ->", request.nextUrl.pathname);

    let response = NextResponse.next({
        request: {
        headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
            // 1. Set cookie di request (hapus maxAge dan expires agar jadi Session Cookie)
            cookiesToSet.forEach(({ name, value, options }) => {
                const sessionOptions = { ...options };
                delete sessionOptions.maxAge;
                delete sessionOptions.expires;
                request.cookies.set(name, value)
            })
            
            response = NextResponse.next({ request })
            
            // 2. Set cookie di response (hapus maxAge dan expires juga)
            cookiesToSet.forEach(({ name, value, options }) => {
                const sessionOptions = { ...options };
                delete sessionOptions.maxAge;
                delete sessionOptions.expires;
                response.cookies.set(name, value, sessionOptions)
            })
            },
        },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'

    if (isDashboard && !user) {
        console.log("DITENDANG: Gak ada session!");
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthPage && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
    }

    export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}