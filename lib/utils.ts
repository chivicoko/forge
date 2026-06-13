import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrencySymbol(currency: string): string {
  const map: Record<string, string> = {
    USD: "$", CAD: "$", GBP: "£", YEN: "¥", NGN: "₦", EUR: "€"
  }
  return map[currency] ?? "₦"
}

export function formatPrice(price: number, rate: number, currency: string): string {
  const converted = price / rate
  return `${getCurrencySymbol(currency)}${converted.toFixed(2)}`
}

export function parseAmountIntoNumberFormat(amount: string): string {
  return Number(amount).toLocaleString()
}

export function scheduleTokenRefresh(token: string, refreshFn: () => Promise<void>) {
  try {
    const [, payload] = token.split(".")
    const decoded = JSON.parse(atob(payload))
    const expiresAt = decoded.exp * 1000
    const now = Date.now()
    const delay = expiresAt - now - 60_000 // refresh 1 min before expiry
    if (delay > 0) {
      setTimeout(refreshFn, delay)
    } else {
      refreshFn()
    }
  } catch {
    // silent
  }
}
