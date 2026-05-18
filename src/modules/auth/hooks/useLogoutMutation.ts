import { useMutation } from '@tanstack/react-query'
import { logoutApi } from '@/services/auth'
import { fetchDataAsync } from '@/utils'
import { useErrorStore } from '@/store/useErrorStore'

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
