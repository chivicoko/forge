export const dynamic = "force-dynamic"
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return <SignUp appearance={{ variables: { colorPrimary: "#F59E0B" } }} />
}
