import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();
    const isAuthRoute = url.pathname.startsWith('/auth');
    
    // Specifically protect these routes from unauthenticated users
    const isProtectedRoute = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/onboarding');

    // If user is not logged in and trying to access a directly protected route
    if (!user && isProtectedRoute) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (user) {
        // Logged in user hitting auth callback, etc
        // Let's check if they have a profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        const hasProfile = !!profile;
        const isOnboarding = url.pathname === '/onboarding';

        // Logged in but no profile? Go to /onboarding
        if (!hasProfile && !isOnboarding && !isAuthRoute) {
            url.pathname = '/onboarding';
            return NextResponse.redirect(url);
        }

        // Logged in with a profile? Go to /dashboard
        if (hasProfile && (isOnboarding || url.pathname === '/')) {
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
