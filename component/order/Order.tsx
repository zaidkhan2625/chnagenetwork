"use client";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";
import { useAuth } from '@/app/context/AuthContext';

function Order() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("authToken");
  const {user} = useAuth();
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = user.role==="Manager"?"/api/orderbyteam":"/api/order";
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("orderdata",data);
        if (res.ok) {
          setOrders(data); // Assuming your API returns an array of orders
        } else {
          Swal.fire("Error", "Failed to fetch orders", "error");
        }
      } catch (err) {
        Swal.fire("Error", "An error occurred while fetching orders", "error");
      }
    };

    fetchOrders();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products); // assuming products are inside `products` key
        } else {
          console.error("Failed to fetch products:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/order/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          Swal.fire('Deleted!', 'The order has been deleted.', 'success');
          setOrders(orders.filter(order => order._id !== orderId));
        } else {
          Swal.fire('Error!', 'Failed to delete order.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center">Orders</h2>
      <div className="space-y-4 text-black">
        {orders.map(order => {
          const product = products.find(p => p._id === order.product);
          if (!product) return null;

          return (
            <div key={order._id} className="flex items-center justify-between border p-4 rounded-md shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-grow ml-4">
                <h3 className="font-semibold text-lg">Product name{product.name}</h3>
                <p className="text-sm text-black"><span  className="font-semibold text-lg">Product Description</span>:{product.description}</p>
                <p className="text-sm text-gray-800 mt-1"><span  className="font-semibold text-lg">customerName: </span><strong>{order.customerName}</strong></p>
                <p className="text-sm text-gray-800 mt-1"><span  className="font-semibold text-lg">Status: </span><strong>{order.status}</strong></p>

              </div>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDelete(order._id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Order;
