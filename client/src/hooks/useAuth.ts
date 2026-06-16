import {
  login,
  logout,
  registrasi,
  simpanSession,
  type TipeDataMasuk,
  type TipeDataRegistrasi,
} from "@/services/auth.service";
import { setLogout, setLoading, setUser } from "@/stores/slices/auth.slice";
import type { AppDispatch, RootState } from "@/stores/store";
import { useSelector, useDispatch } from "react-redux";

function showAlert(type: "success" | "error", message: string) {
  alert(message);
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleRegistrasi = async (data: TipeDataRegistrasi) => {
    dispatch(setLoading(true));
    try {
      const response = await registrasi(data);
      if (response.sukses && response.data) {
        simpanSession(response.data);
        dispatch(
          setUser({
            id: response.data.id,
            email: response.data.email,
            namaLengkap: response.data.namaLengkap,
            peran: response.data.peran,
          }),
        );
        showAlert("success", response.pesan);
        return true;
      } else {
        showAlert("error", response.pesan);
        return false;
      }
    } catch {
      showAlert(
        "error",
        "Terjadi kesalahan pada registrasi, mohon untuk mencobanya sekali lagi.",
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (data: TipeDataMasuk) => {
    dispatch(setLoading(true));
    try {
      const response = await login(data);
      if (response.sukses && response.data) {
        simpanSession(response.data);
        dispatch(
          setUser({
            id: response.data.id,
            email: response.data.email,
            namaLengkap: response.data.namaLengkap,
            peran: response.data.peran,
          }),
        );
        showAlert("success", response.pesan);
        return true;
      } else {
        showAlert("error", response.pesan);
        return false;
      }
    } catch {
      showAlert(
        "error",
        "Terjadi kesalahan pada login, mohon untuk mencobanya sekali lagi.",
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    logout();
    dispatch(setLogout());
    showAlert("success", "Anda telah keluar dari akun.");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    registrasi: handleRegistrasi,
    login: handleLogin,
    logout: handleLogout,
  };
};
