"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Product } from "@/lib/store" // Import Product type

// Helper to map snake_case to camelCase for consistency
const mapProductFromDb = (item: any): Product => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: Number.parseFloat(item.price),
  originalPrice: item.original_price ? Number.parseFloat(item.original_price) : undefined,
  image: item.image,
  rating: Number.parseFloat(item.rating),
  reviews: item.reviews,
  prepTime: item.prep_time,
  serves: item.serves,
  tags: item.tags || [], // Ensure tags is an array
  calories: item.calories,
  category: item.category,
  popular: item.popular,
  createdAt: item.created_at,
})

export async function addProductAction(
  prevState: any,
  formData: FormData,
): Promise<{ success: boolean; message?: string; product?: Product }> {
  const supabase = createServerSupabaseClient()

  // --- START: Detailed Logging for Debugging ---
  console.log("--- addProductAction received formData ---")
  for (const [key, value] of formData.entries()) {
    // For image, log only a snippet to avoid flooding logs with base64
    if (key === "image" && typeof value === "string" && value.length > 100) {
      console.log(`${key}: ${value.substring(0, 100)}... (length: ${value.length})`)
    } else {
      console.log(`${key}: ${value}`)
    }
  }
  console.log("-----------------------------------------")
  // --- END: Detailed Logging for Debugging ---

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const priceStr = formData.get("price") as string
  const originalPriceStr = formData.get("originalPrice") as string
  const prepTime = formData.get("prepTime") as string
  const servesStr = formData.get("serves") as string
  const tags = formData.get("tags") as string
  const calories = formData.get("calories") as string
  const category = formData.get("category") as string
  const popular = formData.get("popular") === "on" // Checkbox value
  const image = formData.get("image") as string

  // Basic validation
  if (!name || !description || !priceStr) {
    return { success: false, message: "Product Name, Description, and Price are required." }
  }

  const price = Number.parseFloat(priceStr)
  if (isNaN(price)) {
    return { success: false, message: "Price must be a valid number." }
  }

  const originalPrice = originalPriceStr ? Number.parseFloat(originalPriceStr) : null
  if (originalPriceStr && isNaN(originalPrice!)) {
    return { success: false, message: "Original Price must be a valid number if provided." }
  }

  const serves = servesStr ? Number.parseInt(servesStr) : 1 // Default to 1 if empty
  if (servesStr && isNaN(serves)) {
    return { success: false, message: "Serves must be a valid number." }
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price,
        original_price: originalPrice, // Use null for optional numeric fields
        image: image || `/placeholder.svg?height=250&width=350&text=${encodeURIComponent(name)}`,
        prep_time: prepTime || null, // Use null for optional text fields
        serves,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        calories: calories || null,
        category: category || null,
        popular,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error adding product:", error) // Log full error object
      return { success: false, message: `Failed to add product: ${error.message || "Unknown database error"}` }
    }

    revalidatePath("/") // Revalidate the public menu page to show new item
    revalidatePath("/admin") // Revalidate the admin dashboard to show new item
    return { success: true, message: "Product added successfully!", product: mapProductFromDb(data) }
  } catch (e: any) {
    console.error("Unexpected error in addProductAction:", e)
    return { success: false, message: `An unexpected error occurred: ${e.message || "Please try again."}` }
  }
}

export async function updateProductAction(
  prevState: any,
  formData: FormData,
): Promise<{ success: boolean; message?: string; product?: Product }> {
  const supabase = createServerSupabaseClient()

  // --- START: Detailed Logging for Debugging ---
  console.log("--- updateProductAction received formData ---")
  for (const [key, value] of formData.entries()) {
    // For image, log only a snippet to avoid flooding logs with base64
    if (key === "image" && typeof value === "string" && value.length > 100) {
      console.log(`${key}: ${value.substring(0, 100)}... (length: ${value.length})`)
    } else {
      console.log(`${key}: ${value}`)
    }
  }
  console.log("-----------------------------------------")
  // --- END: Detailed Logging for Debugging ---

  const id = Number(formData.get("id")) // Hidden input for product ID
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const priceStr = formData.get("price") as string
  const originalPriceStr = formData.get("originalPrice") as string
  const prepTime = formData.get("prepTime") as string
  const servesStr = formData.get("serves") as string
  const tags = formData.get("tags") as string
  const calories = formData.get("calories") as string
  const category = formData.get("category") as string
  const popular = formData.get("popular") === "on"
  const image = formData.get("image") as string

  // Basic validation
  if (!id || !name || !description || !priceStr) {
    return { success: false, message: "Product ID, Name, Description, and Price are required for update." }
  }

  const price = Number.parseFloat(priceStr)
  if (isNaN(price)) {
    return { success: false, message: "Price must be a valid number." }
  }

  const originalPrice = originalPriceStr ? Number.parseFloat(originalPriceStr) : null
  if (originalPriceStr && isNaN(originalPrice!)) {
    return { success: false, message: "Original Price must be a valid number if provided." }
  }

  const serves = servesStr ? Number.parseInt(servesStr) : 1 // Default to 1 if empty
  if (servesStr && isNaN(serves)) {
    return { success: false, message: "Serves must be a valid number." }
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        original_price: originalPrice,
        image: image || `/placeholder.svg?height=250&width=350&text=${encodeURIComponent(name)}`,
        prep_time: prepTime || null,
        serves,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        calories: calories || null,
        category: category || null,
        popular,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error updating product:", error) // Log full error object
      return { success: false, message: `Failed to update product: ${error.message || "Unknown database error"}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, message: "Product updated successfully!", product: mapProductFromDb(data) }
  } catch (e: any) {
    console.error("Unexpected error in updateProductAction:", e)
    return { success: false, message: `An unexpected error occurred: ${e.message || "Please try again."}` }
  }
}

export async function deleteProductAction(id: number): Promise<{ success: boolean; message?: string }> {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Supabase error deleting product:", error)
      return { success: false, message: `Failed to delete product: ${error.message || "Unknown database error"}` }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, message: "Product deleted successfully!" }
  } catch (e: any) {
    console.error("Unexpected error in deleteProductAction:", e)
    return { success: false, message: `An unexpected error occurred: ${e.message || "Please try again."}` }
  }
}
