import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("admin123", 12);

  const { error: userError } = await supabase
    .from("users")
    .upsert(
      { name: "Super Admin", email: "admin@ndi.org", password, role: "super_admin" },
      { onConflict: "email" }
    );

  if (userError) console.error("User seed error:", userError);
  else console.log("Super admin created: admin@ndi.org / admin123");

  const categories = [
    { name: "Science & Technology", description: "Books on science, engineering, and technology" },
    { name: "Arts & Humanities", description: "Literature, history, philosophy, and the arts" },
    { name: "Business & Economics", description: "Business management, finance, and economics" },
    { name: "Health & Medicine", description: "Medical sciences and healthcare" },
    { name: "Law", description: "Legal studies and jurisprudence" },
    { name: "Education", description: "Teaching methods and educational resources" },
    { name: "Social Sciences", description: "Psychology, sociology, and political science" },
    { name: "Mathematics", description: "Pure and applied mathematics" },
  ];

  for (const cat of categories) {
    const { error } = await supabase
      .from("categories")
      .upsert(cat, { onConflict: "name" });
    if (error) console.error(`Category seed error (${cat.name}):`, error);
  }

  console.log("Categories seeded");
  console.log("Done!");
}

seed().catch(console.error);
