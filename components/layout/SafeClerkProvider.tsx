"use client"
import { ClerkProvider } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export function SafeClerkProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // During SSR/SSG, render children without Clerk to avoid build-time key validation
  if (!mounted) return <>{children}</>

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""}>
      {children}
    </ClerkProvider>
  )
}
