import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

const SAFE_NEXT_DEFAULT = "/demo";

function safeNext(raw: string | null): string {
  if (!raw) return SAFE_NEXT_DEFAULT;
  if (!raw.startsWith("/") || raw.startsWith("//")) return SAFE_NEXT_DEFAULT;
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/connect?error=missing_code`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase exchangeCodeForSession failed", error);
    return NextResponse.redirect(`${origin}/connect?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
