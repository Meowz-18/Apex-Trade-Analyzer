import { NextResponse } from "next/server";

// This route handles the OAuth redirect from Google after sign-in.
// Supabase automatically handles the code exchange.
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const next = searchParams.get("next") ?? "/dashboard";
    return NextResponse.redirect(`${origin}${next}`);
}
