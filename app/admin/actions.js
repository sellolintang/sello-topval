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

export async function changePasswordAction(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password dan konfirmasi password tidak sama." };
  }

  const supabase = await createClientSsr();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu." };
  }
  
  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password berhasil diganti." };
}

