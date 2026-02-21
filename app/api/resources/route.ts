import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ResourceItem = {
  id: number;
  title: string;
  url: string;
  description: string | null;
};

/**
 * GET /api/resources — list external resources for the client landing page
 */
export async function GET() {
  try {
    const rows = await prisma.resource.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    const list: ResourceItem[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      url: r.url,
      description: r.description,
    }));

    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/resources", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
