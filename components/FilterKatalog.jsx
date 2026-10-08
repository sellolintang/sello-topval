"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Tombol from "./Tombol";
import Input from "./Input";

export default function FilterKatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [kategori, setKategori] = useState(searchParams.get("kategori") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", kategori);
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-garis bg-permukaan p-4">
      <div className="flex-1 min-w-[200px]">
        <Input 
          label="Cari nama produk" 
          name="q" 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          placeholder="Contoh: Kopi"
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <Input 
          label="Kategori" 
          name="kategori" 
          value={kategori} 
          onChange={(e) => setKategori(e.target.value)} 
          placeholder="Semua kategori"
        />
      </div>
      <Tombol type="submit">Filter</Tombol>
    </form>
  );
}

