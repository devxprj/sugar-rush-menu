// This is a Server Component, so no 'use client' directive here.
import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import AdminDashboard from "@/components/admin-dashboard" // Import the client component

export default async function AdminPage() {
  // This check runs on the server
  if (!isAuthenticated()) {
    redirect("/admin/login")
  }

  // If authenticated, render the client-side AdminDashboard
  return <AdminDashboard />
}
