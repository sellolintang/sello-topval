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

import { revalidatePath } from "next/cache";

export async function updateProdukAction(formData) {
  const supabase = await createClientSsr();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Akses ditolak. Anda harus login terlebih dahulu.");
  }
  
  const id = formData.get("id");
  const nama = formData.get("nama");
  const harga = formData.get("harga");
  const kategori = formData.get("kategori");
  const foto_url = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  const { error } = await supabase
    .from("produk")
    .update({ nama, harga, kategori, foto_url, deskripsi })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function tambahProdukAction(formData) {
  const supabase = await createClientSsr();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Akses ditolak. Anda harus login terlebih dahulu.");
  }
  
  const nama = formData.get("nama");
  const harga = formData.get("harga");
  const kategori = formData.get("kategori");
  const foto_url = formData.get("foto_url");
  const deskripsi = formData.get("deskripsi");

  const { error } = await supabase
    .from("produk")
    .insert([{ nama, harga, kategori, foto_url, deskripsi }]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function hapusProdukAction(id) {
  const supabase = await createClientSsr();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Akses ditolak. Anda harus login terlebih dahulu.");
  }
  
  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function generateDeskripsiAction(nama, kategori) {
  const supabase = await createClientSsr();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "GEMINI_API_KEY belum diatur di environment variable." };
  }

  const prompt = `Buat deskripsi menarik untuk produk jualan online.
Nama produk: ${nama}
Kategori: ${kategori || "Umum"}

Buat maksimal 2 paragraf singkat, menarik untuk pembeli, dan gunakan bahasa Indonesia yang baik.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      return { error: `Gagal dari API Gemini (${res.status})` };
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return { deskripsi: text.trim() };
  } catch (err) {
    return { error: err.message };
  }
}

