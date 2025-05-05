import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({ isOpen, onClose, productId, productName }) => {
  const token = Cookies.get("authToken");
  const [customerName, setCustomerName] = useState('');
  const [orderStatus, setOrderStatus] = useState('Pending');

  const handlePlaceOrder = async () => {
    if (!customerName) {
      Swal.fire('Error!', 'Please provide customer name.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          customerName,
          status: orderStatus,
        }),
      });

      if (res.ok) {
        Swal.fire('Success!', 'Order placed successfully!', 'success');
        onClose(); // Close the modal after placing order
      } else {
        const data = await res.json();
        Swal.fire('Error!', data.message || 'Failed to place order.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-xl font-semibold text-gray-800">Place Order</h2>
            <div className="mt-4">
              <label className="block text-sm text-gray-700">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-700">Order Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              >
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrderModal;
