"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const pesan = `Halo, saya tertarik dengan produk ${produk.nama} seharga ${formatRupiah(produk.harga)}, jumlah: ${jumlah}.`;
  const hrefWa = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label htmlFor="jumlah" className="text-sm font-medium">
          Jumlah:
        </label>
        <input
          id="jumlah"
          type="number"
          min="1"
          value={jumlah}
          onChange={(e) => setJumlah(parseInt(e.target.value) || 1)}
          className="w-20 rounded-md border border-garis bg-latar-belakang px-3 py-1.5 text-sm outline-none focus:border-utama"
        />
      </div>
      <a
        href={hrefWa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
