import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 px-4 md:px-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-w-xl p-10 rounded-2xl bg-base-100 border border-base-200 shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center gap-6">
              <h3 className="font-bold text-4xl font-lobster text-center text-base-content">
                Logout
              </h3>
              <p className="font-semibold text-base font-mona text-center text-base-content/70">
                Anda yakin ingin keluar meninggalkan{" "}
                <span className="font-bold text-base-content">
                  Nusa Residence
                </span>
                ?
              </p>
            </div>

            <div className="divider text-base font-semibold font-mona text-secondary mt-8">
              jangan lupa untuk mampir lagi
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-6">
              <button
                className="btn w-full font-mona bg-transparent text-base-content rounded-xl font-semibold border border-base-content hover:border-neutral hover:text-neutral hover:bg-neutral/10 transition cursor-pointer"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                className="btn w-full font-mona bg-base-content text-neutral-content rounded-xl font-semibold border border-base-content/0 hover:bg-neutral transition cursor-pointer"
                onClick={handleLogout}
              >
                Keluar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
