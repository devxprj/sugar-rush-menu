"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, X, Upload, ImageIcon, LogOut, Download, Loader2 } from "lucide-react" // Added Loader2
import { ProductStore, type Product } from "@/lib/store"
import { logoutAction } from "@/app/admin/actions"
import { QRCodeSVG } from "qrcode.react"
import { useActionState } from "react"
import { addProductAction, updateProductAction, deleteProductAction } from "@/app/admin/products/actions"
import { uploadImageAction } from "@/app/admin/upload/actions" // Import the new upload action

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false) // New state for image upload loading
  const fileInputRef = useRef<HTMLInputElement>(null)
  const qrCodeRef = useRef<SVGSVGElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // IMPORTANT: Replace with your actual deployed menu URL
  const menuUrl = "https://thesweetlife.shop" // <--- Update this line

  // useActionState for add/edit form
  const [addEditState, addEditFormAction, isAddEditPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (editingProduct) {
        formData.append("id", editingProduct.id.toString())
        return await updateProductAction(prevState, formData)
      } else {
        return await addProductAction(prevState, formData)
      }
    },
    null,
  )

  // Form state (now managed by useActionState, but still useful for UI inputs)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    prepTime: "",
    serves: "1",
    tags: "",
    calories: "",
    category: "",
    popular: false,
    image: "", // This will now store the URL from Supabase Storage
  })

  useEffect(() => {
    loadProducts()
  }, [])

  // Effect to handle form submission success/error
  useEffect(() => {
    if (addEditState?.success) {
      loadProducts() // Reload products after successful add/update
      resetForm()
      setShowAddForm(false)
      setEditingProduct(null)
    } else if (addEditState?.message) {
      alert(addEditState.message) // Show error message
    }
  }, [addEditState])

  const loadProducts = async () => {
    const storedProducts = await ProductStore.getProducts()
    setProducts(storedProducts)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploadingImage(true)
      const uploadFormData = new FormData()
      uploadFormData.append("image_file", file)

      const result = await uploadImageAction(null, uploadFormData) // Call the new upload action

      if (result.success && result.imageUrl) {
        setImagePreview(result.imageUrl)
        setFormData({ ...formData, image: result.imageUrl })
      } else {
        alert(result.message || "Failed to upload image.")
        setImagePreview("")
        setFormData({ ...formData, image: "" })
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
      setIsUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData({ ...formData, image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // TODO: Optionally, implement deletion from Supabase Storage here
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      prepTime: product.prepTime,
      serves: product.serves.toString(),
      tags: product.tags.join(", "),
      calories: product.calories,
      category: product.category,
      popular: product.popular,
      image: product.image, // This will be the URL
    })
    setImagePreview(product.image)
    setShowAddForm(true)
  }

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProductAction(id)
      if (result.success) {
        loadProducts()
      } else {
        alert(result.message)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      prepTime: "",
      serves: "1",
      tags: "",
      calories: "",
      category: "",
      popular: false,
      image: "",
    })
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.href = pngFile
        downloadLink.download = "restaurant-menu-qr-code.png"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-black text-white">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Manage SugarRush menu</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => window.open("/", "_blank")}
                variant="outline"
                className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" />
                View Menu
              </Button>
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{products.filter((p) => p.popular).length}</div>
              <div className="text-sm text-gray-600">Popular Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{new Set(products.map((p) => p.category)).size}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)} className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form action={addEditFormAction} ref={formRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hidden input for ID when editing */}
                  {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}

                  {/* Image Upload Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg mb-2"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-1"
                              disabled={isUploadingImage}
                            >
                              {isUploadingImage ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {isUploadingImage ? "Uploading..." : "Change Image"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeImage}
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              disabled={isUploadingImage}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Upload a product image</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {isUploadingImage ? "Uploading..." : "Choose Image"}
                          </Button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        name="image_file" // This input will send the actual file to uploadImageAction
                      />
                      {/* Hidden input to pass the image URL to add/update product actions */}
                      <input type="hidden" name="image" value={formData.image} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter product description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time</label>
                    <input
                      type="text"
                      name="prepTime"
                      value={formData.prepTime}
                      onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="15-20 min"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                    <input
                      type="number"
                      name="serves"
                      value={formData.serves}
                      onChange={(e) => setFormData({ ...formData, serves: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Healthy, BBQ, Italian"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                    <input
                      type="text"
                      name="calories"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="520 cal"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Healthy, Protein Rich, Gluten Free"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="popular"
                        name="popular"
                        checked={formData.popular}
                        onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                        Mark as Popular Item
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isAddEditPending || isUploadingImage} // Disable if image is uploading
                  >
                    {isAddEditPending
                      ? editingProduct
                        ? "Updating..."
                        : "Adding..."
                      : editingProduct
                        ? "Update Product"
                        : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProduct(null)
                      resetForm()
                    }}
                    className="flex-1"
                    disabled={isAddEditPending || isUploadingImage}
                  >
                    Cancel
                  </Button>
                </div>
                {addEditState?.message && (
                  <p className={`mt-2 text-sm ${addEditState.success ? "text-green-600" : "text-red-600"}`}>
                    {addEditState.message}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* QR Code Section in Admin Dashboard */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Menu QR Code</h3>
            <p className="text-gray-600 mb-4">
              Scan this QR code to view the live customer menu, or download it to print.
            </p>
            <div className="flex justify-center p-4 border border-gray-300 rounded-lg w-fit mx-auto mb-4">
              <QRCodeSVG value={menuUrl} size={192} level="H" ref={qrCodeRef} />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Menu URL:{" "}
              <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {menuUrl}
              </a>
            </p>
            <Button onClick={handleDownloadQRCode} className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download QR Code (PNG)
            </Button>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Products ({products.length})</h3>

          {products.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400">
                  <Plus className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                  <p className="text-sm">Add your first product to get started!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        {product.popular && <Badge className="bg-pink-100 text-pink-800 text-xs">Popular</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-green-600">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                          )}
                          <span className="text-gray-500">{product.category}</span>
                        </div>
                        <span className="text-gray-500">
                          {product.prepTime} • {product.calories}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
