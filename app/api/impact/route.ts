import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ImpactEventRow = {
  id: number;
  title: string;
  date: string;
  foodDistributedAmount: string | null;
  foodWastePrevented: string | null;
};

export type ImpactResponse = {
  totalEvents: number;
  totalCheckIns: number;
  eventImpact: ImpactEventRow[];
  checkInsWithFoodCount: number;
  foodReceivedAmounts: string[];
};

/**
 * GET /api/impact — aggregate stats for staff Impact page
 */
export async function GET() {
  try {
    const [events, checkIns] = await Promise.all([
      prisma.event.findMany({
        orderBy: { date: "desc" },
        select: {
          id: true,
          title: true,
          date: true,
          foodDistributedAmount: true,
          foodWastePrevented: true,
        },
      }),
      prisma.checkIn.findMany({
        select: { foodReceivedAmount: true },
      }),
    ]);

    const foodReceivedAmounts = checkIns
      .map((c) => c.foodReceivedAmount)
      .filter((v): v is string => v != null && String(v).trim() !== "");

    const response: ImpactResponse = {
      totalEvents: events.length,
      totalCheckIns: checkIns.length,
      eventImpact: events.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        foodDistributedAmount: e.foodDistributedAmount,
        foodWastePrevented: e.foodWastePrevented,
      })),
      checkInsWithFoodCount: foodReceivedAmounts.length,
      foodReceivedAmounts,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/impact", error);
    return NextResponse.json(
      { error: "Failed to fetch impact data" },
      { status: 500 }
    );
  }
}
