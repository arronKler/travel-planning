import { NextRequest, NextResponse } from "next/server"

export const POST = (request: NextRequest) => {
  return NextResponse.json({
    name: "goods",
  })
}
