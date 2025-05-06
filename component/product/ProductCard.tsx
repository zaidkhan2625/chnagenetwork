import { useAuth } from '@/app/context/AuthContext';
import { Pencil, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";
import AddProductModal from './AddProductModal';
import PlaceOrderModal from './PlaceOrderModal';

function ProductCard({ name, description, price,onRefresh, image, id, onDelete }: any) {
  const { user } = useAuth();
  const token = Cookies.get("authToken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaceOrderModalOpen, setIsPlaceOrderModalOpen] = useState(false);
  useEffect(()=>{
   
  },[name, description, price, image, id, onDelete])
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          Swal.fire('Deleted!', 'The product has been deleted.', 'success');
          if (onRefresh) onRefresh(); // ✅ Refresh after deletion
          if (onDelete) onDelete(id); // Call callback to update UI
        } else {
          const data = await res.json();
          Swal.fire('Error!', data.message || 'Failed to delete product.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img className="w-full h-full object-fit" src={image} alt={name} />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="mt-1 text-sm text-gray-600 flex-grow mb-3 line-clamp-3">
          {description}
        </p>

        {user.role === 'Employee' ? (
          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold text-gray-900">{price}</span>
            <button
              className="px-3 py-1 bg-indigo-600 text-white cursor-pointer text-sm font-medium rounded-md hover:bg-indigo-700"
              onClick={() => setIsPlaceOrderModalOpen(true)}
            >
              Place Order
            </button>
          </div>
        ) : (
          <div className="flex flex-row justify-between mt-4">
            <Pencil className="text-black cursor-pointer" onClick={() => setIsModalOpen(true)} />
            <Trash className="text-red-600 cursor-pointer" onClick={handleDelete} />
          </div>
        )}
      </div>

      {/* AddProductModal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
       
        name={name}
        description={description}
        price={price}
        image={image}
        id={id}
        onRefresh={onRefresh} // Optional: pass to card for delete

      />

      {/* PlaceOrderModal */}
      <PlaceOrderModal
        isOpen={isPlaceOrderModalOpen}
        onClose={() => setIsPlaceOrderModalOpen(false)}
        productId={id}
        productName={name}
      />
    </div>
  );
}

export default ProductCard;
