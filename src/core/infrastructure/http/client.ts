import type { ApiHttpError } from '@/core/domain/models/errors'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (body !== undefined && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    })

    if (res.status === 204) {
      return undefined as T
    }

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: res.statusText }))
      if (res.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/auth/login'
      }
      throw { status: res.status, body: errorBody } as ApiHttpError
    }

    return res.json()
  }

  get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', path, undefined, params)
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body)
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body)
  }

  delete<T = void>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }
}

export const http = new HttpClient()
