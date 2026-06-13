"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("forge-cookie-consent")
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem("forge-cookie-consent", "true")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-background border rounded-xl shadow-xl p-4">
      <div className="flex gap-3">
        <Cookie className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold mb-1">We use cookies</p>
          <p className="text-xs text-muted-foreground mb-3">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
          <div className="flex gap-2">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" onClick={accept}>Accept</Button>
            <Button size="sm" variant="outline" onClick={() => setShow(false)}>Decline</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
