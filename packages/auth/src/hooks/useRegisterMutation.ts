import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest } from "@frontend/shared";
import { registerApi } from "../services/auth";
import { useErrorStore } from "@frontend/shared/store/useErrorStore.ts";
import { fetchDataAsync } from "@frontend/shared";

export function useRegisterMutation() {
  const setError = useErrorStore((s) => s.setError);

  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      fetchDataAsync({
        asyncFn: () => registerApi(data),
        setError,
        menuName: "register",
      }),
  });
}