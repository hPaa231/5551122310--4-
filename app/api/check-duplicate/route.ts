import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { field, value } = body;

  const dummyDb: Record<string, string[]> = {
    email: ["test@example.com", "admin@example.com"],
    nickname: ["tester", "admin"],
  };

  const list = dummyDb[field];

  if (!list) {
    return NextResponse.json(
      { error: "Invalid field provided", exists: false },
      { status: 400 }
    );
  }

  const exists = list.includes(value);
  return NextResponse.json({ exists });
}
