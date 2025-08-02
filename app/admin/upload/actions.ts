"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid" // For generating unique filenames

export async function uploadImageAction(
  prevState: any,
  formData: FormData,
): Promise<{ success: boolean; message?: string; imageUrl?: string }> {
  const supabase = createServerSupabaseClient()
  const imageFile = formData.get("image_file") as File

  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: "No image file provided." }
  }

  if (!imageFile.type.startsWith("image/")) {
    return { success: false, message: "Invalid file type. Please upload an image." }
  }

  if (imageFile.size > 5 * 1024 * 1024) {
    // 5MB limit
    return { success: false, message: "Image size exceeds 5MB limit." }
  }

  const fileExtension = imageFile.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExtension}`
  const filePath = `product-images/${fileName}` // Path inside your Supabase bucket

  try {
    const { data, error } = await supabase.storage
      .from("menu-images") // <--- THIS IS THE BUCKET NAME THE CODE IS LOOKING FOR
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false, // Do not overwrite existing files
      })

    if (error) {
      console.error("Supabase Storage upload error:", error)
      return { success: false, message: `Image upload failed: ${error.message}` }
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage.from("menu-images").getPublicUrl(filePath)

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return { success: false, message: "Failed to get public URL for uploaded image." }
    }

    return { success: true, message: "Image uploaded successfully!", imageUrl: publicUrlData.publicUrl }
  } catch (e: any) {
    console.error("Unexpected error during image upload:", e)
    return {
      success: false,
      message: `An unexpected error occurred during upload: ${e.message || "Please try again."}`,
    }
  }
}
