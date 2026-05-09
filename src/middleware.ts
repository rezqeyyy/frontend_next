// // src/middleware.ts
// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   // 1. Kasih LOG biar kita tahu middleware-nya JALAN
//   console.log("SATPAM KERJA: Ngecek path ->", request.nextUrl.pathname);

//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
//           response = NextResponse.next({ request })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   // 2. Cek User secara REAL-TIME ke Supabase
//   const { data: { user } } = await supabase.auth.getUser()

//   const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
//   const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'

//   // KONDISI A: Mau ke Dashboard tapi NGGAK ADA USER -> Tendang ke Login
//   if (isDashboard && !user) {
//     console.log("DITENDANG: Gak ada session!");
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // KONDISI B: Udah login tapi mau ke Login/Register -> Lempar ke Dashboard
//   if (isAuthPage && user) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     /*
//      * Matcher ini nge-cover semua kecuali file statis (gambar/css)
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }