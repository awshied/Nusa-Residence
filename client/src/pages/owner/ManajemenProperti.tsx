import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Plus } from "lucide-react";

import type { TipeProperti } from "@/types";
import { useOwnerProperty } from "@/hooks/useProperti";

import Loading from "@/components/layout/Loading";
import PropertiModal from "@/components/layout/PropertiModal";
import StatisticCard from "@/components/layout/StatisticCard";
import emptyProperty from "@/assets/empty-property.png";
import propertyManagementIcon from "@/assets/icons/property-management-outline.png";

const ManajemenProperti = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProperti, setSelectedProperti] = useState<TipeProperti | null>(
    null,
  );
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [propertiToDelete, setPropertiToDelete] = useState<TipeProperti | null>(
  //   null,
  // );

  const { data: propertiList = [], isLoading } = useOwnerProperty();
  // const hapusProperti = useDeleteProperty();

  // const handleEdit = (properti: TipeProperti) => {
  //   setSelectedProperti(properti);
  //   setShowModal(true);
  // };

  // const handleDelete = async () => {
  //   if (!propertiToDelete) return;
  //   await hapusProperti.mutateAsync(propertiToDelete.id);
  //   setShowDeleteModal(false);
  //   setPropertiToDelete(null);
  // };

  // const getKategoriBadge = (kategori: string) => {
  //   const colors: Record<string, string> = {
  //     HOTEL: "badge-primary",
  //     VILLA: "badge-secondary",
  //     APARTEMEN: "badge-accent",
  //     KOSAN: "badge-info",
  //     KONTRAKAN: "badge-success",
  //   };
  //   return colors[kategori] || "badge-ghost";
  // };

  // const getKategoriLabel = (kategori: string) => {
  //   const labels: Record<string, string> = {
  //     HOTEL: "Hotel",
  //     VILLA: "Villa",
  //     APARTEMEN: "Apartemen",
  //     KOSAN: "Kosan",
  //     KONTRAKAN: "Kontrakan",
  //   };
  //   return labels[kategori] || kategori;
  // };

  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }

  return (
    <>
      <div className="space-y-6 mt-6 px-4 lg:px-0">
        {/* Statistic Card - All Device */}
        <div className="mx-auto grid grid-cols-3 gap-2 lg:gap-4">
          <StatisticCard
            title="Total Properti"
            value="3"
            icon={propertyManagementIcon}
          />
          <StatisticCard
            title="Total Booking"
            value="3"
            icon={propertyManagementIcon}
          />
          <StatisticCard
            title="Tingkat Hunian"
            value="3"
            icon={propertyManagementIcon}
          />
        </div>

        {/* Mobile - Small Size */}
        <div className="flex lg:hidden breadcrumbs items-center ml-1">
          <ul>
            <li>
              <img
                src={propertyManagementIcon}
                alt="page icon"
                className="w-4 h-4"
              />
            </li>
            <li>
              <p className="text-sm font-medium text-base-content font-mona">
                Kelola
              </p>
            </li>
            <li>
              <p className="text-sm font-medium text-base-content font-mona">
                Properti
              </p>
            </li>
          </ul>
        </div>

        {/* Empty Property List - All Device */}
        {propertiList.length === 0 ? (
          <div className="card bg-base-100 rounded-lg shadow-none lg:shadow-xl mb-12 lg:mb-0">
            <div className="card-body items-center justify-center py-12 lg:py-24 mx-0 lg:mx-24">
              <img
                src={emptyProperty}
                alt="admin not found"
                className="w-30 h-30 mb-6"
              />
              <h3 className="text-xl lg:text-2xl font-bold text-base-content font-poppins text-center">
                Properti Kosong
              </h3>
              <p className="text-base-content/70 text-sm lg:text-base font-semibold font-mona text-center mb-4">
                Anda belum menambahkan satu pun properti ke dalam sistem sebagai
                tempat penginapan bagi para tamu
              </p>
              <button
                onClick={() => {
                  setSelectedProperti(null);
                  setShowModal(true);
                }}
                className="flex items-center justify-center gap-2 shrink-0 rounded-lg py-3 px-6 bg-base-content hover:bg-neutral text-neutral-content font-semibold font-mona cursor-pointer"
              >
                Tambah Properti Baru
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop - Large Size */}

            {/* Mobile - Small Size */}
          </>
        )}

        {/* {propertiList.length === 0 ? (
          <div className="card bg-base-100 rounded-lg shadow-xl">
            <div className="card-body items-center justify-center py-24 mx-24">
              <img
                src={emptyProperty}
                alt="prperty not found"
                className="w-36 h-36 mb-4"
              />
              <h3 className="text-2xl font-bold text-base-content font-poppins text-center mb-2">
                Properti Kosong
              </h3>
              <p className="text-base-content/70 text-base font-semibold font-mona text-center mb-4">
                Anda belum menambahkan satu pun properti ke dalam sistem sebagai
                tempat penginapan bagi para tamu
              </p>
              <button
                onClick={() => {
                  setSelectedProperti(null);
                  setShowModal(true);
                }}
                className="flex items-center justify-center gap-2 shrink-0 rounded-lg py-3 px-6 bg-base-content hover:bg-neutral text-neutral-content font-semibold font-mona cursor-pointer"
              >
                Buat Properti Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {propertiList.map((properti) => (
              <div
                key={properti.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="card-title text-xl">{properti.nama}</h2>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span
                          className={`badge ${getKategoriBadge(properti.kategori)}`}
                        >
                          {getKategoriLabel(properti.kategori)}
                        </span>
                        <span className="badge badge-ghost">
                          {properti.tipeKamar?.length || 0} Tipe Kamar
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleEdit(properti)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-error"
                        onClick={() => {
                          setPropertiToDelete(properti);
                          setShowDeleteModal(true);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {properti.namaJalan}, {properti.kelurahan},{" "}
                    {properti.kecamatan}, {properti.kabupatenKota}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span>📱</span>
                      <span>{properti.nomorTelepon || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📐</span>
                      <span>{properti.luasBangunan || "-"} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👤</span>
                      <span>
                        {properti.admin?.namaLengkap ||
                          properti.admin?.email ||
                          "Belum ada admin"}
                      </span>
                    </div>
                  </div>

                  {properti.amenities && properti.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {properti.amenities.slice(0, 4).map((amenity, index) => (
                        <span
                          key={index}
                          className="badge badge-ghost badge-sm"
                        >
                          {amenity
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      ))}
                      {properti.amenities.length > 4 && (
                        <span className="badge badge-ghost badge-sm">
                          +{properti.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/owner/properti/${properti.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Detail
                    </Link>
                    <Link
                      to={`/owner/properti/kamar/${properti.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      Kelola Kamar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}

        {/* Modal Konfirmasi Hapus */}
        {/* {showDeleteModal && propertiToDelete && (
          <dialog
            className="modal modal-open"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowDeleteModal(false);
            }}
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg text-error">Hapus Properti?</h3>
              <p className="py-4">
                Apakah Anda yakin ingin menghapus properti{" "}
                <strong>"{propertiToDelete.nama}"</strong>?
                <br />
                <span className="text-sm text-error">
                  ⚠️ Tindakan ini akan menghapus semua data terkait (kamar,
                  booking, dll) dan tidak dapat dibatalkan.
                </span>
              </p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDelete}
                  disabled={hapusProperti.isPending}
                >
                  {hapusProperti.isPending ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )} */}
      </div>

      <PropertiModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProperti(null);
        }}
        properti={selectedProperti}
      />
    </>
  );
};

export default ManajemenProperti;
