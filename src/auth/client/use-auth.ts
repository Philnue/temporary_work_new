import { getRouteApi } from '@tanstack/react-router'

const protectedRouteApi = getRouteApi('/_protected')

export function useAuth() {
  return protectedRouteApi.useRouteContext()
}
