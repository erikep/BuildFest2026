import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/volunteer/interests
 * Body: { name?: string; email?: string; phone?: string; interests?: string; availability?: string }
 * Creates a volunteer interest record (no auth; userId null).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      interests?: string;
      availability?: string;
    };

    const name = body.name != null ? String(body.name).trim() || null : null;
    const email = body.email != null ? String(body.email).trim() || null : null;
    const phone = body.phone != null ? String(body.phone).trim().replace(/\D/g, "") || null : null;
    let interests = body.interests != null ? String(body.interests).trim() || null : null;
    const availability = body.availability != null ? String(body.availability).trim() || null : null;

    if (availability) {
      interests = interests ? `${interests}\nAvailability: ${availability}` : `Availability: ${availability}`;
    }

    const row = await prisma.volunteerInterest.create({
      data: {
        userId: null,
        name,
        email,
        phone,
        interests,
      },
    });

    return NextResponse.json(
      { id: row.id, success: true, message: "Thank you for your interest! We'll be in touch." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/volunteer/interests", error);
    return NextResponse.json(
      { error: "Failed to submit volunteer interest" },
      { status: 500 }
    );
  }
}
