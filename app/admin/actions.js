"use server";

import { createClientSsr } from "@/lib/supabase/ssr";
import { redirect } from "next/navigation";

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createClientSsr();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClientSsr();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

