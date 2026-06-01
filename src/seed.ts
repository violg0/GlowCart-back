import "dotenv/config";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { realtime: { transport: WebSocket as any } }
);

async function seed() {
  const email    = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const role     = process.env.SEED_ADMIN_ROLE ?? "superadmin";

  if (!email || !password) {
    console.error("❌ Define SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD en tu .env");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("admin_users").insert({
    email,
    password_hash: hash,
    role,
  });

  if (error) {
    console.error("❌ Error:", error.message);
  } else {
    console.log(`✅ Admin creado: ${email} / rol: ${role}`);
  }

  process.exit(0);
}

seed();