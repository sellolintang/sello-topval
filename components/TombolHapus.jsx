"use client";

import Tombol from "@/components/Tombol";
import { hapusProdukAction } from "@/app/admin/actions";
import { useTransition } from "react";

export default function TombolHapus({ id }) {
  const [isPending, startTransition] = useTransition();

  const handleHapus = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      startTransition(async () => {
        try {
          await hapusProdukAction(id);
        } catch (error) {
          alert(error.message);
        }
      });
    }
  };

  return (
    <Tombol type="button" varian="bahaya" onClick={handleHapus} disabled={isPending}>
      {isPending ? "Menghapus..." : "Hapus"}
    </Tombol>
  );
}
