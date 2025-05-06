'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import AddMemberForm from './AddMemberFormProps';
import Swal from 'sweetalert2';
import { useAuth } from '@/app/context/AuthContext';
import Cookies from "js-cookie";

interface Member {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    managerId: string | null;
    initialData?: Member
}

export default function Team() {
    const [teamMembers, setTeamMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    // Fetch team members from API
    const { user } = useAuth();
    const token = Cookies.get("authToken");

    const fetchMembers = async () => {
        try {
            const url = user.role === "Manager" ? "/api/team" : "/api/users";
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log("data", data);
            setTeamMembers(data);
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        }
    };
    useEffect(() => {


        fetchMembers();
    }, []);

    // Find manager name by ID
    const getManagerName = (managerId: string | null) => {
        const manager = teamMembers.find((m) => m._id === managerId);
        return manager?.fullName || '-';
    };

    const filteredMembers = teamMembers.filter(
        (member) =>
            member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const managers = teamMembers.filter((m) => m.role === 'Manager');

    const handleAdd = () => setShowAddModal(true);

    const handleSubmitNewMember = () => {
        // Adding the new member to the list
        fetchMembers();
    };


    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`/api/users/${id}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    setTeamMembers((prev) => prev.filter((member) => member._id !== id));

                    Swal.fire({
                        title: 'Deleted!',
                        text: 'User has been deleted.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } else {
                    const data = await res.json();
                    Swal.fire('Error', data.message || 'Failed to delete user', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Something went wrong!', 'error');
            }
        }
    };


    return (
        <div className="p-6 w-full mx-auto text-black">
            <div className="flex flex-col sm:flex-row justify-between text-black items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {user.role == "Admin" ? <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    <Plus size={18} /> Add Member
                </button> : ""}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="text-left py-3 px-6">Name</th>
                            <th className="text-left py-3 px-6">Email</th>
                            <th className="text-left py-3 px-6">Role</th>
                            {user.role == "Manager" ? "" : <th className="text-left py-3 px-6">Manager</th>}

                            {user.role == "Manager" ? "" : <th className="text-left py-3 px-6">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member) => (
                            <tr key={member._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-6">{member.fullName}</td>
                                <td className="py-3 px-6">{member.email}</td>
                                <td className="py-3 px-6">{member.role}</td>
                                {user.role == "Manager" ? "" : <td className="py-3 px-6">
                                    {member.role === 'Employee' ? getManagerName(member.managerId) : '-'}
                                </td>}
                                {user.role == "Manager" ? "" :
                                    <td className="py-3 px-6 flex gap-2">
                                        <button
                                            className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded"
                                            onClick={() => {
                                                setEditingMember(member);
                                                setShowAddModal(true);
                                            }}
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded"
                                            onClick={() => handleDelete(member._id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <AddMemberForm
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingMember(null);
                    }}
                    onSubmit={handleSubmitNewMember}
                    initialData={editingMember} // 👈
                    managers={managers}

                />
            )}

        </div>
    );
}
