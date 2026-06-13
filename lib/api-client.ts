import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const client = axios.create({ baseURL: API_BASE_URL })
const plainClient = axios.create({ baseURL: API_BASE_URL })

let isRefreshing = false
let queue: ((token: string) => void)[] = []

const subscribe = (cb: (token: string) => void) => queue.push(cb)
const publish = (token: string) => { queue.forEach((cb) => cb(token)); queue = [] }

export const refreshFn = async () => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      token: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
    })
    const newToken = data.access_token
    if (typeof window !== "undefined") localStorage.setItem("accessToken", newToken)
    client.defaults.headers.common.Authorization = `Bearer ${newToken}`
  } catch (err) {
    console.error("Auto-refresh failed:", err)
  }
}

client.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken")
    if (token && req.headers) {
      req.headers.Authorization = `Bearer ${token}`
    }
  }
  return req
})

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig
    const is401 = error.response?.status === 401
    const rt = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null

    if (!is401 || original?._retry || !rt) return Promise.reject(error)
    original._retry = true

    if (isRefreshing) {
      return new Promise((resolve) =>
        subscribe((newToken) => {
          if (original.headers) original.headers.Authorization = `Bearer ${newToken}`
          resolve(client(original))
        })
      )
    }

    isRefreshing = true
    try {
      const { data } = await plainClient.post("/auth/refresh-token", { token: rt })
      const newToken = data.access_token
      if (typeof window !== "undefined") localStorage.setItem("accessToken", newToken)
      client.defaults.headers.common.Authorization = `Bearer ${newToken}`
      publish(newToken)
      if (original.headers) original.headers.Authorization = `Bearer ${newToken}`
      return client(original)
    } catch {
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)
