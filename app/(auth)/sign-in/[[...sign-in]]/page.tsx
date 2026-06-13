export const dynamic = "force-dynamic"
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return <SignIn appearance={{ variables: { colorPrimary: "#F59E0B" } }} />
}
