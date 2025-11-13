import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://api.vercel.com/v1/analytics/endpoints/${process.env.PROJECT_ID}/summary?period=7d`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
