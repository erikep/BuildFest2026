import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ActionItemResponse = { // TODO: Create action items from the staff page and assign to individual users
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
};

/**
 * GET /api/action-items — list action items for the client landing page
 */
export async function GET() {
  try {
    const rows = await prisma.actionItem.findMany({
      orderBy: [{ dueDate: "asc" }, { id: "asc" }],
    });

    const list: ActionItemResponse[] = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      dueDate: r.dueDate ? r.dueDate.toISOString().slice(0, 10) : null,
      completed: r.completed,
    }));

    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/action-items", error);
    return NextResponse.json(
      { error: "Failed to fetch action items" },
      { status: 500 }
    );
  }
}
