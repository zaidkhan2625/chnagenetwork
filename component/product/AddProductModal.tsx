"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function AddProductModal({ isOpen, onClose, onAdd, name, description, price, image, id }: any) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  useEffect(() => {
    if (name || description || price || image) {
      setForm({
        name: name || "",
        description: description || "",
        price: price || "",
        image: null,
      });
      setImagePreview(image || null);
    }
  }, [name, description, price, image]);
  const isEditMode = !!id;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const token = Cookies.get("authToken");

  const uploadToCloudinary = async (file:any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append('upload_preset', 'nextjs_uploads'); // <--- from Cloudinary
    // replace with your Cloudinary preset

    const res = await fetch('https://api.cloudinary.com/v1_1/djnccikqw/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = imagePreview || ""; // default to existing image
      if (form.image) {
        imageUrl = await uploadToCloudinary(form.image);
      }

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `/api/products/${id}` : "/api/products";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: form.price,
          image: imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to submit");

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Product Updated" : "Product Added",
        text: isEditMode
          ? "The product was updated successfully!"
          : "The product was added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      onAdd && onAdd(result.product);
      setForm({ name: "", description: "", price: "", image: null });
      setImagePreview(null);
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:  "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-30">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-black text-center mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {isEditMode ? "update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
