import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mockEvents = [
  {
    title: "Food Drive",
    date: "2026-03-10",
    location: "Community Center",
    description: "Help us collect non-perishable food items for families in need.",
  },
  {
    title: "Clothing Swap",
    date: "2026-03-22",
    location: "Main Hall",
    description: "Bring gently used clothing and pick up something new to you.",
  },
  {
    title: "Volunteer Orientation",
    date: "2026-04-05",
    location: "Room 201",
    description: "Learn about upcoming volunteer opportunities in your neighborhood.",
  },
];

async function main() {
  const existing = await prisma.event.findMany();
  const existingTitles = new Set(existing.map((e) => e.title));

  for (const event of mockEvents) {
    if (!existingTitles.has(event.title)) {
      await prisma.event.create({ data: event });
      console.log("Created:", event.title);
    }
  }

  const count = await prisma.event.count();
  console.log("Events in DB:", count);

  // Seed sample locations (food shelves / kitchens) if none exist
  const existingLocations = await prisma.location.findMany();
  if (existingLocations.length === 0) {
    const sampleLocations = [
      { name: "Community Food Shelf", type: "SHELF", address: "123 Main St", latitude: 44.9537, longitude: -93.09, url: null },
      { name: "Downtown Kitchen", type: "KITCHEN", address: "456 Oak Ave", latitude: 44.96, longitude: -93.10, url: null },
    ];
    for (const loc of sampleLocations) {
      await prisma.location.create({ data: loc });
      console.log("Created location:", loc.name);
    }
    console.log("Locations in DB:", sampleLocations.length);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
