/**
 * Event shape matching API response (FIRSTTASK.md).
 * Used by Staff form and POST /api/events body.
 */
export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  foodDistributedAmount?: string | null;
  foodWastePrevented?: string | null;
};

export type CreateEventInput = Omit<Event, "id">;
