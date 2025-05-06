// ProductGrid.tsx
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';
import { useAuth } from '@/app/context/AuthContext';

interface Product {
    name: string;
    description: string;
    price: string;
    image: string;
    _id: string;
}

export default function ProductGrid() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const { user } = useAuth();

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products);
            } else {
                console.error("Failed to fetch products:", data.error);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, []);
    const triggerRefresh = () => {
        fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    
    const handleAddProduct = (newProduct: Product) => {
        // Optional: use fetch instead to avoid duplicates
        setProducts(prev => [...prev, newProduct]);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <div className="relative text-black max-w-md w-full">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full p-3 pl-10 pr-4 border text-black border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-3 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                {user?.role !== "Employee" && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white cursor-pointer px-5 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Add Product
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.image}
                        onRefresh={triggerRefresh} // Optional: pass to card for delete
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No products match your search.</p>
                </div>
            )}

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddProduct}
                onRefresh={fetchProducts} // Optional: pass to card for delete

            />
        </div>
    );
}
