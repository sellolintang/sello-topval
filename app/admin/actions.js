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
  const deskripsi = formData.get("deskripsi");
  
  // Ambil URL lama dari database untuk jaga-jaga kalau tidak ada upload baru dan URL kosong
  const { data: produkLama } = await supabase.from("produk").select("foto_url").eq("id", id).single();
  const foto_url = await uploadFotoIfNeeded(formData, produkLama?.foto_url);

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
  const deskripsi = formData.get("deskripsi");
  
  const foto_url = await uploadFotoIfNeeded(formData, "");

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

import { supabaseServer } from "@/lib/supabase/server";

async function uploadFotoIfNeeded(formData, fotoUrlLama = "") {
  const fotoFile = formData.get("foto_file");
  let finalFotoUrl = formData.get("foto_url"); // manual url input

  // If there's an actual file uploaded
  if (fotoFile && fotoFile.size > 0) {
    // 1. Ensure bucket 'produk' exists and is public
    const { data: buckets } = await supabaseServer.storage.listBuckets();
    if (!buckets?.find((b) => b.name === "produk")) {
      await supabaseServer.storage.createBucket("produk", { public: true });
    }

    // 2. Prepare file
    const fileExt = fotoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Convert File to Buffer for Supabase Node.js SDK
    const arrayBuffer = await fotoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload file
    const { data, error } = await supabaseServer.storage
      .from("produk")
      .upload(fileName, buffer, {
        contentType: fotoFile.type,
      });

    if (error) {
      throw new Error(`Gagal upload foto: ${error.message}`);
    }

    // 4. Get public URL
    const { data: publicUrlData } = supabaseServer.storage
      .from("produk")
      .getPublicUrl(fileName);
      
    finalFotoUrl = publicUrlData.publicUrl;
  }
  
  return finalFotoUrl || fotoUrlLama;
}

