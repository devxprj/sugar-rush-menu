import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const SESSION_COOKIE_NAME = "admin_session"
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function login(username: string, password: string) {
  // In a real application, you would hash passwords and compare securely
  // For this example, we're using environment variables directly.
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set a simple session cookie
    cookies().set(SESSION_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })
    return { success: true }
  } else {
    return { success: false, error: "Invalid credentials" }
  }
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME)
  redirect("/admin/login")
}

export function isAuthenticated(): boolean {
  return cookies().get(SESSION_COOKIE_NAME)?.value === "authenticated"
}
