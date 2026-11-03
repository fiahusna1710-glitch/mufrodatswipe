import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", app: "mufrodat-academy", timestamp: new Date().toISOString() });
}
