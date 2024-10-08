"use client"
import {useAuthStore} from "@/features/auth/hooks/use-auth-store"

export default function ProfilePage() {
  const {user} = useAuthStore()
  return (
    <div>
      <h1>Profile Page</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
