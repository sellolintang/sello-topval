"use client";

import { useState, useRef } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { generateDeskripsiAction } from "@/app/admin/actions";

export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const namaRef = useRef(null);
  const kategoriRef = useRef(null);

  const handleGenerateAI = async () => {
    const nama = namaRef.current?.value;
    const kategori = kategoriRef.current?.value;
    if (!nama) {
      alert("Isi nama produk terlebih dahulu.");
      return;
    }
    
    setIsLoadingAi(true);
    try {
      const result = await generateDeskripsiAction(nama, kategori);
      if (result.error) {
        alert("Gagal: " + result.error);
      } else {
        setDeskripsi(result.deskripsi);
      }
    } catch (e) {
      alert("Error memanggil AI");
    }
    setIsLoadingAi(false);
  };

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}
      
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Nama produk</label>
        <input 
          ref={namaRef} 
          name="nama" 
          defaultValue={produk.nama} 
          required 
          className="rounded-lg border border-garis bg-latar-belakang px-4 py-3 outline-none focus:border-utama"
        />
      </div>

      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Kategori</label>
        <input 
          ref={kategoriRef} 
          name="kategori" 
          defaultValue={produk.kategori} 
          className="rounded-lg border border-garis bg-latar-belakang px-4 py-3 outline-none focus:border-utama"
        />
      </div>

      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Deskripsi</label>
          <button 
            type="button" 
            onClick={handleGenerateAI}
            disabled={isLoadingAi}
            className="text-sm font-semibold text-utama hover:underline disabled:opacity-50"
          >
            {isLoadingAi ? "Membuat..." : "✨ Buat dengan AI"}
          </button>
        </div>
        <textarea
          name="deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows="4"
          className="rounded-lg border border-garis bg-latar-belakang px-4 py-3 outline-none focus:border-utama"
        ></textarea>
      </div>

      <div className="flex gap-3">
        <Tombol type="submit">{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
