import { useState, useEffect } from 'react';
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
  ChevronRight
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
  const { products: storeProducts, fetchProducts } = useProductStore();
  const { addProduct, deleteProduct, updateProduct } = useAdminStore();
  const [products, setProducts] = useState(storeProducts);

  // Sync state if store updates
  useEffect(() => {
    setProducts(storeProducts);
  }, [storeProducts]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewProduct, setViewProduct] = useState<typeof products[0] | null>(null);
  const [editProduct, setEditProduct] = useState<typeof products[0] | null>(null);
  const itemsPerPage = 10;

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'goggles',
    price: 0,
    stockCount: 0,
    description: '',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Please fill in required fields');
      return;
    }
    await addProduct(newProduct);
    fetchProducts();
    setNewProduct({
      name: '',
      category: 'goggles',
      price: 0,
      stockCount: 0,
      description: '',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80'
    });
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
      fetchProducts(); // Refresh the list from backend
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct || !editProduct.name || !editProduct.price) {
      toast.error('Please fill in required fields');
      return;
    }
    await updateProduct(editProduct.id, editProduct);
    fetchProducts();
    setEditProduct(null);
    toast.success('Product updated successfully');
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
                 <div className="space-y-4 py-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name</label>
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
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 border rounded-lg" 
                        placeholder="0.00" 
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
                  <Button className="w-full btn-primary" onClick={handleAddProduct}>
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
                <div className="space-y-4 py-4">
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
                        onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
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
                      <label className="block text-sm font-medium mb-2">Price</label>
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
                    <Button variant="outline" className="flex-1" onClick={() => setEditProduct(null)}>
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
