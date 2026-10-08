import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL belum diatur di environment variable");
}

if (!process.env.SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_SECRET_KEY belum diatur di environment variable");
}

export const supabaseServer = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

