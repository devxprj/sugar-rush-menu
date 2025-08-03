"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, Heart, MapPin, Phone, Instagram, Facebook } from "lucide-react"
import { ProductStore, type Product } from "@/lib/store"
import { getSupabaseClient } from "@/lib/supabase"
import Image from "next/image"

export default function RestaurantMenu() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const loadProducts = async () => {
      const storedProducts = await ProductStore.getProducts()
      setProducts(storedProducts)
      setLoading(false)
    }

    loadProducts()

    const channel = supabase
      .channel("products_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        console.log("Change received!", payload)
        loadProducts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Group products by category
  const groupedProducts = products.reduce(
    (acc, product) => {
      const category = product.category || "Uncategorized" // Default category if none is set
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

  // Custom sort order for categories
  const sortedCategories = Object.keys(groupedProducts).sort((a, b) => {
    if (a === "Main Items") return -1 // Main Items always first
    if (b === "Main Items") return 1
    if (a === "Add-Ons") return 1 // Add-Ons always last
    if (b === "Add-Ons") return -1
    return a.localeCompare(b) // Alphabetical for others
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Desktop & Mobile Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          <div className="text-center">
            <div className="relative w-48 h-24 mx-auto mb-2">
              <Image
                src="/images/sugar-rush-logo.png"
                alt="Sugar Rush Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <p className="text-sm lg:text-lg text-white mb-4">The Sweet Life</p>

            {/* Restaurant Info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm lg:text-base">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                <span>Al-Marj Street, Deir Kifa, Lebanon</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-green-400" />
                <span>Mon-Sun: 5:00 PM - 12:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-red-400" />
                <span className="font-semibold">+961 78 954 777</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {products.length === 0 ? (
          <div className="text-center py-12 lg:py-20">
            <div className="text-gray-400 mb-4">
              <div className="h-16 w-16 lg:h-24 lg:w-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl lg:text-4xl">🍽️</span>
              </div>
              <h3 className="text-lg lg:text-2xl font-semibold">No items available</h3>
              <p className="text-sm lg:text-base">Check back later for delicious food options!</p>
            </div>
          </div>
        ) : (
          <>
            {sortedCategories.map((category) => (
              <div key={category} className="mb-8 lg:mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {groupedProducts[category].map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Image Section */}
                      <div className="relative h-48 lg:h-56">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 lg:top-3 left-2 lg:left-3 flex flex-col gap-1 lg:gap-2">
                          {product.popular && (
                            <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs lg:text-sm">
                              <Heart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 fill-current" />
                              Popular
                            </Badge>
                          )}
                          {product.originalPrice && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs lg:text-sm">
                              Save ${(product.originalPrice - product.price).toFixed(2)}
                            </Badge>
                          )}
                        </div>

                        <Badge className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-blue-500 text-white text-xs lg:text-sm">
                          {product.category}
                        </Badge>

                        {/* Price */}
                        <div className="absolute bottom-2 lg:bottom-3 right-2 lg:right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 lg:px-4 py-1 lg:py-2">
                          <div className="flex items-center gap-2">
                            {product.originalPrice && (
                              <span className="text-sm lg:text-base text-gray-500 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-lg lg:text-xl font-bold text-gray-900">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="p-4 lg:p-6">
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 lg:mb-3">{product.name}</h3>

                        <p className="text-gray-600 text-sm lg:text-base mb-3 lg:mb-4 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 lg:gap-2 mb-3 lg:mb-4">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs lg:text-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Info Row */}
                        <div className="flex justify-between text-xs lg:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span>{product.calories}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Simplified Footer */}
      <footer className="bg-black text-white py-8 lg:py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Media */}
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/share/1BKj1bhUg2/?mibextid=wwXIfr"
              className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/sugar_rushlb?igsh=NnVrOTV3dGVteTl5"
              className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@sugar_rushlb?_t=ZS-8yWQuOffJYn&_r=1"
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors flex items-center justify-center"
            >
              <Image
                src="/images/tiktok-logo-circle.png" // Updated to new image path
                alt="TikTok"
                width={20} // Adjust size as needed
                height={20} // Adjust size as needed
                // Removed filter invert as the new image is already white on black
              />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">© 2025 Sugar Rush All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
