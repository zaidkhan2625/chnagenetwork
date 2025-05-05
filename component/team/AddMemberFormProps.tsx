'use client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert for notifications

interface AddMemberFormProps {
    onClose: () => void;
    onSubmit: (data: Member) => void;
    managers: Member[];
    initialData?: Member | null; // ✅ Add this line
}

interface Member {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    managerId: string | null;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ onClose, onSubmit, initialData }: any) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'Employee',
        managerId: '',
    });
    const [teamMembers, setTeamMembers] = useState<Member[]>([]);
    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData?.fullName || '',
                email: initialData?.email || '',
                password: initialData?.password || '',
                role: initialData?.role || '',
                managerId: initialData?.managerId || '',
            });

        }
    }, [initialData]);
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch('/api/users'); // 🔁 Change this to your actual route
                const data = await res.json();
                setTeamMembers(data);
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            }
        };

        fetchMembers();
    }, []);

    const managers = teamMembers.filter((m) => m.role === 'Manager');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // API call to create a new member
        const response = await fetch(initialData ? `/api/users/${initialData._id}` : '/api/users', { // Replace with your actual API endpoint
            method: initialData ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'Member added successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                onSubmit(); // Pass the data up to parent
                onClose(); // Close the modal
                
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: result.error || 'An error occurred.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-transparent text-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Add New Member</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="w-full border px-4 py-2 rounded"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border px-4 py-2 rounded"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border px-4 py-2 rounded"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    >
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                    </select>

                    {formData.role === 'Employee' && (
                        <select
                            name="managerId"
                            value={formData.managerId}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        >
                            <option value="">Select Manager</option>
                            {managers.length > 0 ? (
                                managers.map((manager) => (
                                    <option key={manager._id} value={manager._id}>
                                        {manager.fullName}
                                    </option>
                                ))
                            ) : (
                                <option disabled value="">
                                    Add a manager first to assign an employee
                                </option>
                            )}
                        </select>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-300"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberForm;
