import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Sample inquiries (only insert if empty)
  const inquiryCount = await prisma.inquiry.count();
  if (inquiryCount === 0) {
    await prisma.inquiry.createMany({
      data: [
        {
          name: "Priya Sharma",
          phone: "+919876543210",
          email: "priya@example.com",
          pickupCity: "Ahmedabad",
          dropCity: "Mumbai",
          houseSize: "2 BHK",
          movingDate: new Date("2026-04-20"),
          notes: "Need fragile packing for glassware",
          status: "new",
        },
        {
          name: "Rohit Kumar",
          phone: "+919812345678",
          email: "rohit@example.com",
          pickupCity: "Delhi",
          dropCity: "Bangalore",
          houseSize: "3 BHK",
          movingDate: new Date("2026-04-25"),
          notes: "5th floor with lift",
          status: "contacted",
        },
      ],
    });
    console.log("  ✓ Sample inquiries inserted");
  } else {
    console.log(`  · Found ${inquiryCount} existing inquiries — skipping seed.`);
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
