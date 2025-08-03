"use client"

import { getSupabaseClient } from "@/lib/supabase" // Import the Supabase client

// Shared data store using Supabase for persistence
export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  prepTime: string | null // Can be null from DB
  serves: number
  tags: string[]
  calories: string | null // Can be null from DB
  category: string | null // Can be null from DB
  popular: boolean
  createdAt: string
}

export class ProductStore {
  private static supabase = getSupabaseClient()

  static async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    // Map snake_case from database to camelCase for frontend
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number.parseFloat(item.price), // Convert numeric string to number
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
    }))
  }

  // Removed addProduct, updateProduct, deleteProduct methods from here.
  // They are now handled by Server Actions in app/admin/products/actions.ts
}
