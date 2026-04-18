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

  // Sample blog posts (only insert if empty)
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    await prisma.blogPost.create({
      data: {
        title: "Complete Guide to House Shifting in India: Tips from Experts",
        slug: "complete-guide-house-shifting-india",
        excerpt: "Moving to a new home? Learn everything you need to know about safe and efficient house shifting in India. From packing tips to choosing the right packers and movers.",
        content: `<h2>Introduction</h2>
<p>Moving to a new home is an exciting yet challenging experience. Whether you're shifting within your city or relocating to a different state, proper planning is essential to ensure a smooth and stress-free move.</p>

<h2>1. Start Planning Early</h2>
<p>Experts recommend starting your moving preparations at least 4-6 weeks before your moving date. This gives you enough time to:</p>
<ul>
<li>Declutter and organize your belongings</li>
<li>Research and compare packers and movers</li>
<li>Gather packing materials</li>
<li>Notify important parties about your address change</li>
</ul>

<h2>2. Choose the Right Packers and Movers</h2>
<p>Selecting a reliable moving company is crucial. Here's what to look for:</p>
<ul>
<li><strong>Verification:</strong> Ensure they are registered and have proper licenses</li>
<li><strong>Experience:</strong> Check how long they've been in business</li>
<li><strong>Reviews:</strong> Read customer testimonials and ratings</li>
<li><strong>Insurance:</strong> Verify if they provide transit insurance</li>
<li><strong>Transparent Pricing:</strong> Get detailed quotes with no hidden charges</li>
</ul>

<h2>3. Packing Tips for Safe Moving</h2>
<p>Proper packing is the key to protecting your belongings during transit:</p>
<ul>
<li>Use quality packing materials - bubble wrap, corrugated boxes, tape</li>
<li>Pack room by room and label each box clearly</li>
<li>Keep important documents and valuables with you</li>
<li>Wrap fragile items individually with extra padding</li>
<li>Disassemble large furniture and keep screws in labeled bags</li>
</ul>

<h2>4. Create a Moving Checklist</h2>
<p>Stay organized with a comprehensive checklist:</p>
<h3>4-6 Weeks Before:</h3>
<ul>
<li>Sort and declutter belongings</li>
<li>Research moving companies</li>
<li>Start using up perishable items</li>
</ul>
<h3>2-3 Weeks Before:</h3>
<ul>
<li>Book your packers and movers</li>
<li>Start packing non-essential items</li>
<li>Notify banks, utilities, and subscription services</li>
</ul>
<h3>1 Week Before:</h3>
<ul>
<li>Pack most of your belongings</li>
<li>Confirm moving date and time</li>
<li>Prepare an essentials box for the first night</li>
</ul>

<h2>5. Important Documents to Keep Safe</h2>
<p>Always keep these documents with you, not in the moving truck:</p>
<ul>
<li>Identity proofs (Aadhar, PAN, Passport)</li>
<li>Property documents and rent agreements</li>
<li>Insurance papers</li>
<li>Medical records</li>
<li>School/college certificates</li>
<li>Financial documents</li>
</ul>

<h2>6. Cost-Saving Tips</h2>
<p>Save money on your move with these strategies:</p>
<ul>
<li>Move during off-season (avoid summer months and year-end)</li>
<li>Get quotes from multiple companies and negotiate</li>
<li>Pack yourself to save on labor costs</li>
<li>Sell or donate items you don't need</li>
<li>Compare different service packages</li>
</ul>

<h2>7. Safety Precautions</h2>
<p>Ensure a safe moving experience:</p>
<ul>
<li>Don't move hazardous materials yourself</li>
<li>Keep children and pets away during loading/unloading</li>
<li>Take photos of valuable items before packing</li>
<li>Verify the identity of moving crew</li>
<li>Keep emergency contacts handy</li>
</ul>

<h2>8. After the Move</h2>
<p>Once you reach your new home:</p>
<ul>
<li>Check all items for damage before signing delivery receipt</li>
<li>Unpack essentials first</li>
<li>Update your address everywhere</li>
<li>Explore your new neighborhood</li>
<li>Give yourself time to settle in</li>
</ul>

<h2>Conclusion</h2>
<p>Moving doesn't have to be stressful. With proper planning, the right packers and movers, and careful execution, you can make your house shifting experience smooth and enjoyable. Remember, it's always better to invest in professional services than to risk damage to your valuable belongings.</p>

<p>At <strong>राधे Packers and Movers</strong>, we're committed to making your move safe, efficient, and hassle-free. Contact us today for a free consultation and quote!</p>`,
        status: "published",
        author: "राधे Packers Team",
        publishedAt: new Date("2026-04-15"),
        metaTitle: "House Shifting Guide India | राधे Packers",
        metaDescription: "Expert tips for safe and efficient house shifting in India. Learn planning, packing, choosing packers & movers.",
        metaKeywords: "house shifting, packers and movers, moving tips, home relocation, shifting guide India",
        focusKeyword: "house shifting",
      },
    });
    console.log("  ✓ Sample blog post inserted");
  } else {
    console.log(`  · Found ${blogCount} existing blog posts — skipping seed.`);
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
