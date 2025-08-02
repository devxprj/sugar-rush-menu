"use server"

import { login } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const result = await login(username, password)

  if (result.success) {
    redirect("/admin") // This redirect will now be the primary handler
  } else {
    return { success: false, error: result.error }
  }
}
