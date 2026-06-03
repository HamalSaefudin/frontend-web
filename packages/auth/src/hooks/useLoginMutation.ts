import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@frontend/shared";
import { loginApi } from "../services/auth";
import { useErrorStore } from "@frontend/shared/store/useErrorStore.ts";
import { fetchDataAsync } from "@frontend/shared";

export function useLoginMutation() {
  const setError = useErrorStore((s) => s.setError);

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      fetchDataAsync({
        asyncFn: () => loginApi(credentials),
        setError,
        menuName: "login",
      }),
    onSuccess: (response) => {
      const data = response?.data?.data;
      if (data) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    },
    onError: (error: Error) => {
      localStorage.setItem("token", "asdasd");
      localStorage.setItem("refreshToken", "data.refreshToken");
      console.error("[login] Error:", error.message);
    },
  });
}
