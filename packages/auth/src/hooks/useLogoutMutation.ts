import { useMutation } from '@tanstack/react-query'
import { logoutApi } from '../services/auth'
import { fetchDataAsync } from '@frontend/shared'
import { useErrorStore } from '@frontend/shared/store/useErrorStore'

export function useLogoutMutation() {
  const setError = useErrorStore((s) => s.setError)

  return useMutation({
    mutationFn: () =>
      fetchDataAsync({
        asyncFn: logoutApi,
        setError,
        menuName: 'logout',
      }),
    onSuccess: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    },
  })
}
