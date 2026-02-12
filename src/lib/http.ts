import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: "Validation failed",
        issues: error.issues,
      },
      { status: 400 },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      message: fallback,
    },
    { status: 500 },
  );
}
