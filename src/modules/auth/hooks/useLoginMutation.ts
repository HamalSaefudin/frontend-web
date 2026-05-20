import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@/types";
import { loginApi } from "@/services/auth";
import { useErrorStore } from "@/store/useErrorStore";
import { fetchDataAsync } from "@/utils";

export function useLoginMutation() {
  const setError = useErrorStore((s) => s.setError);

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      fetchDataAsync({
        asyncFn: () => loginApi(credentials),
        setError,
        menuName: "login",
      }),
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    },
    onError: (error: Error) => {
      console.error("[login] Error:", error.message);
    },
  });
}
