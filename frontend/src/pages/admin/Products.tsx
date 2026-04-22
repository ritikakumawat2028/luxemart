import { useState, useEffect, useRef } from 'react';
// Products management page
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Upload,
  ImagePlus,
  X
} from 'lucide-react';
import { useProductStore, useAdminStore } from '@/store/store';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function AdminProducts() {
  const { products, fetchProducts } = useProductStore();
  const { addProduct, deleteProduct, updateProduct } = useAdminStore();

  // Load products on mount
  useEffect(() => {
    // Force refetch if empty
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewProduct, setViewProduct] = useState<typeof products[0] | null>(null);
  const [editProduct, setEditProduct] = useState<typeof products[0] | null>(null);
  const itemsPerPage = 10;
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [addDragActive, setAddDragActive] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'goggles',
    price: 0,
    stockCount: 0,
    description: '',
    image: ''
  });

  // Convert file to base64 data URL for preview & storage
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setAddImagePreview(dataUrl);
    setNewProduct({ ...newProduct, image: dataUrl });
  };

  const handleEditImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setEditImagePreview(dataUrl);
    if (editProduct) {
      setEditProduct({ ...editProduct, image: dataUrl });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Please fill in required fields');
      return;
    }
    if (!newProduct.image) {
      toast.error('Please upload a product image');
      return;
    }
    await addProduct(newProduct);
    setNewProduct({
      name: '',
      category: 'goggles',
      price: 0,
      stockCount: 0,
      description: '',
      image: ''
    });
    setAddImagePreview(null);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct || !editProduct.name || !editProduct.price) {
      toast.error('Please fill in required fields');
      return;
    }
    await updateProduct(editProduct.id, editProduct);
    setEditProduct(null);
    setEditImagePreview(null);
  };

  const getStockStatus = (stockCount: number) => {
    if (stockCount === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-600' };
    if (stockCount < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-600' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-600' };
  };

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#1a1a1a]">
                Products
              </h1>
              <p className="text-[#666]">Manage your product catalog</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                 <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Image <span className="text-red-400">*</span></label>
                    
                    {/* Preview */}
                    {(addImagePreview || newProduct.image) ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-200">
                        <img src={addImagePreview || newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => { setAddImagePreview(null); setNewProduct({...newProduct, image: ''}); }}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Drag & Drop Zone */
                      <div
                        className={`relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                          addDragActive ? 'border-[#c0996b] bg-[#c0996b]/5' : 'border-gray-300 bg-gray-50 hover:border-[#c0996b] hover:bg-[#fdf8f3]'
                        }`}
                        onClick={() => addFileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setAddDragActive(true); }}
                        onDragLeave={() => setAddDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setAddDragActive(false);
                          if (e.dataTransfer.files[0]) handleAddImageFile(e.dataTransfer.files[0]);
                        }}
                      >
                        <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleAddImageFile(e.target.files[0]); }}
                    />

                    {/* OR URL Input */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">OR paste image URL</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      <input 
                        type="url" 
                        className="w-full px-4 py-2 border rounded-lg text-sm" 
                        placeholder="https://example.com/image.jpg" 
                        value={addImagePreview ? '' : newProduct.image}
                        onChange={(e) => {
                          setAddImagePreview(null);
                          setNewProduct({...newProduct, image: e.target.value});
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name <span className="text-red-400">*</span></label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        placeholder="Enter product name" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select 
                        className="w-full px-4 py-2 border rounded-lg"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                      >
                        <option value="goggles">Sunglasses</option>
                        <option value="specs">Eyeglasses</option>
                        <option value="perfumes">Perfumes</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹) <span className="text-red-400">*</span></label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        placeholder="0" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        placeholder="0" 
                        value={newProduct.stockCount}
                        onChange={(e) => setNewProduct({...newProduct, stockCount: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                      className="w-full px-4 py-2 border rounded-lg" 
                      rows={3} 
                      placeholder="Enter product description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    ></textarea>
                  </div>
                  <Button className="w-full btn-primary flex items-center justify-center gap-2" onClick={handleAddProduct}>
                    <Upload className="w-4 h-4" />
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#666]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#c9a96e]"
              >
                <option value="all">All Categories</option>
                <option value="goggles">Sunglasses</option>
                <option value="specs">Eyeglasses</option>
                <option value="perfumes">Perfumes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f8f8]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Product</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Price</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Stock</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stockCount);
                    return (
                      <tr key={product.id} className="border-b border-[#e0e0e0] last:border-b-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-[#666]">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize">{product.category}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">₹{product.price.toFixed(2)}</p>
                            {product.originalPrice && (
                              <p className="text-sm text-[#999] line-through">
                                ₹{product.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.stockCount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-[#f0f0f0] rounded-lg">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewProduct(product)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditProduct(product)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(product.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
                <p className="text-sm text-[#666]">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                  {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-[#e0e0e0] rounded-lg disabled:opacity-50 hover:bg-[#f0f0f0]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-[#e0e0e0] rounded-lg disabled:opacity-50 hover:bg-[#f0f0f0]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Product Dialog */}
          <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
              </DialogHeader>
              {viewProduct && (
                <div className="space-y-4 py-4">
                  <img src={viewProduct.image} alt={viewProduct.name} className="w-full h-48 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-semibold text-lg">{viewProduct.name}</h3>
                    <p className="text-[#666] capitalize">{viewProduct.category}</p>
                  </div>
                  <div className="flex justify-between items-center bg-[#f8f8f8] p-3 rounded-lg">
                    <span className="font-medium">Price: ₹{viewProduct.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(viewProduct.stockCount).color}`}>
                      Stock: {viewProduct.stockCount}
                    </span>
                  </div>
                  <p className="text-sm text-[#333] mt-2">{viewProduct.description || 'No description available.'}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              {editProduct && (
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
                  {/* Edit Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Image</label>
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-200">
                      <img src={editImagePreview || editProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => editFileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Change Image
                      </button>
                    </div>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleEditImageFile(e.target.files[0]); }}
                    />

                    {/* OR URL Input */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">OR paste image URL</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      <input 
                        type="url" 
                        className="w-full px-4 py-2 border rounded-lg text-sm" 
                        placeholder="https://example.com/image.jpg" 
                        value={editImagePreview ? '' : editProduct.image}
                        onChange={(e) => {
                          setEditImagePreview(null);
                          setEditProduct({...editProduct, image: e.target.value});
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select 
                        className="w-full px-4 py-2 border rounded-lg"
                        value={editProduct.category}
                        onChange={(e) => setEditProduct({...editProduct, category: e.target.value as any})}
                      >
                        <option value="goggles">Sunglasses</option>
                        <option value="specs">Eyeglasses</option>
                        <option value="perfumes">Perfumes</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({...editProduct, price: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        value={editProduct.stockCount}
                        onChange={(e) => setEditProduct({...editProduct, stockCount: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                      className="w-full px-4 py-2 border rounded-lg" 
                      rows={3} 
                      value={editProduct.description || ''}
                      onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => { setEditProduct(null); setEditImagePreview(null); }}>
                      Cancel
                    </Button>
                    <Button className="flex-1 btn-primary" onClick={handleEditProduct}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
    </AdminLayout>
  );
}
