import {
  getCurrentUser,
  login,
  logout,
  lupaPassword,
  pembaruanProfil,
  registrasi,
  resetPassword,
  simpanSession,
} from "@/services/auth.service";
import { setLogout, setLoading, setUser } from "@/stores/slices/auth.slice";
import type { AppDispatch, RootState } from "@/stores/store";
import type {
  TipeDataLupaPassword,
  TipeDataMasuk,
  TipeDataRegistrasi,
  TipeDataResetPassword,
  UpdateProfilePayload,
} from "@/types";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, isError } = useSelector(
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
            fotoProfil: response.data.fotoProfil || null,
            peran: response.data.peran,
          }),
        );
        toast.success(response.pesan);

        navigate("/");
        return true;
      } else {
        toast.error(response.pesan);
        return false;
      }
    } catch {
      toast.error(
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
            fotoProfil: response.data.fotoProfil || null,
            peran: response.data.peran,
          }),
        );
        toast.success(response.pesan);

        if (response.data.peran === "PEMILIK") {
          navigate("/owner/dashboard");
        } else {
          navigate("/");
        }

        return true;
      } else {
        toast.error(response.pesan);
        return false;
      }
    } catch {
      toast.error(
        "Terjadi kesalahan pada login, mohon untuk mencobanya sekali lagi.",
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLupaPassword = async (data: TipeDataLupaPassword) => {
    dispatch(setLoading(true));
    try {
      const response = await lupaPassword(data);
      if (response.sukses) {
        toast.success(response.pesan);
        return true;
      } else {
        toast.error(response.pesan);
        return false;
      }
    } catch {
      toast.error(
        "Terjadi kesalahan pada lupa password, mohon untuk mencobanya sekali lagi.",
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleResetPassword = async (data: TipeDataResetPassword) => {
    dispatch(setLoading(true));
    try {
      const response = await resetPassword(data);
      if (response.sukses && response.data) {
        simpanSession(response.data);
        dispatch(
          setUser({
            id: response.data?.id,
            email: response.data?.email,
            namaLengkap: response.data?.namaLengkap,
            peran: response.data?.peran,
          }),
        );
        toast.success(response.pesan);
        return true;
      } else {
        toast.error(response.pesan);
        return false;
      }
    } catch {
      toast.error(
        "Terjadi kesalahan pada reset password, mohon untuk mencobanya sekali lagi.",
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    logout();
    dispatch(setLogout());
    toast.info("Anda telah keluar dari akun.");
    navigate("/");
  };

  const updateUser = (userData: Parameters<typeof setUser>[0]) => {
    dispatch(setUser(userData));
  };

  const handleUpdateProfil = async (data: UpdateProfilePayload) => {
    dispatch(setLoading(true));
    try {
      const response = await pembaruanProfil(data);

      if (response.sukses && response.data) {
        dispatch(
          setUser({
            id: response.data.id,
            email: response.data.email,
            namaLengkap: response.data.namaLengkap,
            nomorTelepon: response.data.nomorTelepon,
            jenisKelamin: response.data.jenisKelamin,
            fotoProfil: response.data.fotoProfil,
            peran: response.data.peran,
          }),
        );

        const currentUser = getCurrentUser();
        if (currentUser) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...currentUser,
              ...response.data,
            }),
          );
        }

        toast.success("Profil berhasil diperbarui");
        return true;
      } else {
        toast.error(response.pesan);
        return false;
      }
    } catch {
      toast.error("Gagal update profil");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    registrasi: handleRegistrasi,
    login: handleLogin,
    lupaPassword: handleLupaPassword,
    resetPassword: handleResetPassword,
    logout: handleLogout,
    updateProfil: handleUpdateProfil,
    setUser: updateUser,
  };
};
