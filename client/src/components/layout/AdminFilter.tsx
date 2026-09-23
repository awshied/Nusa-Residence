import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Calendar,
  MapPin,
  SortAsc,
  Transgender,
  X,
} from "lucide-react";

export type AdminFilterOptions = {
  status: ("AKTIF" | "NONAKTIF" | "DIBLOKIR")[];
  jenisKelamin: ("PRIA" | "WANITA" | "LAINNYA")[];
  tanggungJawab: "SEMUA" | "ADA" | "TIDAK_ADA";
  urutanDibuat: "TERBARU" | "TERLAMA";
  urutanNama: "A_Z" | "Z_A";
};

type AdminFilterProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdminFilterOptions) => void;
  onReset: () => void;
  initialFilters: AdminFilterOptions;
};

const AdminFilter = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
}: AdminFilterProps) => {
  const [filters, setFilters] = useState<AdminFilterOptions>(initialFilters);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleStatusToggle = (status: "AKTIF" | "NONAKTIF" | "DIBLOKIR") => {
    setFilters((prev) => {
      const current = prev.status;
      if (current.includes(status)) {
        return { ...prev, status: current.filter((s) => s !== status) };
      } else {
        return { ...prev, status: [...current, status] };
      }
    });
  };

  const handleJenisKelaminToggle = (jk: "PRIA" | "WANITA" | "LAINNYA") => {
    setFilters((prev) => {
      const current = prev.jenisKelamin;
      if (current.includes(jk)) {
        return { ...prev, jenisKelamin: current.filter((j) => j !== jk) };
      } else {
        return { ...prev, jenisKelamin: [...current, jk] };
      }
    });
  };

  const handleTanggungJawabChange = (value: "SEMUA" | "ADA" | "TIDAK_ADA") => {
    setFilters((prev) => ({ ...prev, tanggungJawab: value }));
  };

  const handleUrutanDibuatChange = (value: "TERBARU" | "TERLAMA") => {
    setFilters((prev) => ({ ...prev, urutanDibuat: value }));
  };

  const handleUrutanNamaChange = (value: "A_Z" | "Z_A") => {
    setFilters((prev) => ({ ...prev, urutanNama: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop - Large Size */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={onClose}
          className="fixed hidden lg:flex inset-0 z-120 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.45,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="fixed inset-y-0 right-0 z-150 h-full w-86 bg-base-100 border-l-2 border-base-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col py-2 px-6">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 shrink-0">
                <h4 className="font-poppins font-bold text-lg">Filter Admin</h4>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-circle btn-ghost"
                >
                  <X className="w-6 h-6 text-base-content" aria-label="Tutup" />
                </button>
              </div>

              <div className="divider font-medium text-secondary/60 text-xs shrink-0">
                Sesuaikan Kriteria
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto space-y-3">
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-base text-base-content/60">
                        Status Keaktifan
                      </h6>
                    </div>
                    <span className="font-medium text-xs text-secondary/80">
                      (3) Status
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "AKTIF", label: "Aktif" },
                      { value: "NONAKTIF", label: "Cuti" },
                      { value: "DIBLOKIR", label: "Dipecat" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() =>
                          handleStatusToggle(
                            value as "AKTIF" | "NONAKTIF" | "DIBLOKIR",
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                          filters.status.includes(
                            value as "AKTIF" | "NONAKTIF" | "DIBLOKIR",
                          )
                            ? "border-base-content bg-base-content/10 text-base-content"
                            : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Transgender className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-base text-base-content/60">
                        Jenis Kelamin
                      </h6>
                    </div>
                    <span className="font-medium text-xs text-secondary/80">
                      (3) Gender
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "PRIA", label: "Pria" },
                      { value: "WANITA", label: "Wanita" },
                      { value: "LAINNYA", label: "Lainnya" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() =>
                          handleJenisKelaminToggle(
                            value as "PRIA" | "WANITA" | "LAINNYA",
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                          filters.jenisKelamin.includes(
                            value as "PRIA" | "WANITA" | "LAINNYA",
                          )
                            ? "border-base-content bg-base-content/10 text-base-content"
                            : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-base text-base-content/60">
                        Tanggung Jawab
                      </h6>
                    </div>
                    <span className="font-medium text-xs text-secondary/80">
                      (3) Opsi
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "SEMUA", label: "Semua" },
                      { value: "ADA", label: "Ada" },
                      { value: "TIDAK_ADA", label: "Belum Ada" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() =>
                          handleTanggungJawabChange(
                            value as "SEMUA" | "ADA" | "TIDAK_ADA",
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                          filters.tanggungJawab === value
                            ? "border-base-content bg-base-content/10 text-base-content"
                            : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-base text-base-content/60">
                        Waktu Bergabung
                      </h6>
                    </div>
                    <span className="font-medium text-xs text-secondary/80">
                      (2) Pilihan
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "TERBARU", label: "Terbaru" },
                      { value: "TERLAMA", label: "Terlama" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() =>
                          handleUrutanDibuatChange(
                            value as "TERBARU" | "TERLAMA",
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                          filters.urutanDibuat === value
                            ? "border-base-content bg-base-content/10 text-base-content"
                            : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-base text-base-content/60">
                        Urutkan Nama
                      </h6>
                    </div>
                    <span className="font-medium text-xs text-secondary/80">
                      (2) Urutan
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "A_Z", label: "A - Z" },
                      { value: "Z_A", label: "Z - A" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() =>
                          handleUrutanNamaChange(value as "A_Z" | "Z_A")
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                          filters.urutanNama === value
                            ? "border-base-content bg-base-content/10 text-base-content"
                            : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 grid grid-cols-2 gap-3 py-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn border border-base-content/30 rounded-lg font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="btn bg-base-content text-base-100 rounded-lg font-semibold hover:bg-neutral"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile - Small Size */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={onClose}
          className="fixed flex lg:hidden inset-0 z-120 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              duration: 0.45,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="fixed inset-x-0 bottom-0 z-150 h-auto bg-base-100 rounded-t-4xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: Math.min(viewportHeight * 0.9, 800),
              willChange: "transform, opacity",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
            }}
          >
            <div
              className="container mx-auto py-2 px-6 flex flex-col h-auto overflow-hidden"
              style={{
                maxHeight: Math.min(viewportHeight * 0.9, 800),
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
              }}
            >
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-center shrink-0">
                  <span className="bg-base-300 h-1.5 w-10 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center gap-3 mb-4 shrink-0">
                  <div className="flex flex-col justify-center">
                    <h4 className="font-poppins font-bold text-lg">
                      Filter Admin
                    </h4>
                    <span className="text-sm font-medium text-secondary/80">
                      Sesuaikan daftar kriteria Admin
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-circle btn-ghost"
                  >
                    <X
                      className="w-6 h-6 text-base-content"
                      aria-label="Tutup"
                    />
                  </button>
                </div>

                {/* Content */}
                <div
                  className="flex-1 overflow-y-auto overflow-x-hidden space-y-3"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-sm text-base-content/60">
                        Status Keaktifan
                      </h6>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "AKTIF", label: "Aktif" },
                        { value: "NONAKTIF", label: "Cuti" },
                        { value: "DIBLOKIR", label: "Dipecat" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() =>
                            handleStatusToggle(
                              value as "AKTIF" | "NONAKTIF" | "DIBLOKIR",
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                            filters.status.includes(
                              value as "AKTIF" | "NONAKTIF" | "DIBLOKIR",
                            )
                              ? "border-base-content bg-base-content/10 text-base-content"
                              : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <Transgender className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-sm text-base-content/60">
                        Jenis Kelamin
                      </h6>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "PRIA", label: "Pria" },
                        { value: "WANITA", label: "Wanita" },
                        { value: "LAINNYA", label: "Lainnya" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() =>
                            handleJenisKelaminToggle(
                              value as "PRIA" | "WANITA" | "LAINNYA",
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                            filters.jenisKelamin.includes(
                              value as "PRIA" | "WANITA" | "LAINNYA",
                            )
                              ? "border-base-content bg-base-content/10 text-base-content"
                              : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-sm text-base-content/60">
                        Tanggung Jawab
                      </h6>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "SEMUA", label: "Semua" },
                        { value: "ADA", label: "Ada" },
                        { value: "TIDAK_ADA", label: "Belum Ada" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() =>
                            handleTanggungJawabChange(
                              value as "SEMUA" | "ADA" | "TIDAK_ADA",
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                            filters.tanggungJawab === value
                              ? "border-base-content bg-base-content/10 text-base-content"
                              : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-sm text-base-content/60">
                        Waktu Bergabung
                      </h6>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "TERBARU", label: "Terbaru" },
                        { value: "TERLAMA", label: "Terlama" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() =>
                            handleUrutanDibuatChange(
                              value as "TERBARU" | "TERLAMA",
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                            filters.urutanDibuat === value
                              ? "border-base-content bg-base-content/10 text-base-content"
                              : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4 text-base-content/60" />
                      <h6 className="font-semibold text-sm text-base-content/60">
                        Urutkan Nama
                      </h6>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "A_Z", label: "A - Z" },
                        { value: "Z_A", label: "Z - A" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() =>
                            handleUrutanNamaChange(value as "A_Z" | "Z_A")
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border cursor-pointer ${
                            filters.urutanNama === value
                              ? "border-base-content bg-base-content/10 text-base-content"
                              : "border-secondary/70 hover:border-base-content/60 text-base-content/60"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 grid grid-cols-2 gap-3 py-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn border border-base-content/30 rounded-lg font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="btn bg-base-content text-base-100 rounded-lg font-semibold hover:bg-neutral"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AdminFilter;
