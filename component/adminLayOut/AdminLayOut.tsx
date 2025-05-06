"use client"
import React, { JSX, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sun, User, Menu, X, Upload, LayoutGrid, BarChart2, Hotel, Plus, ListOrderedIcon, ListOrdered, ShoppingCart, Package } from "lucide-react";
import Cookies from "js-cookie";
import ProtectedRoutes from "../ProtectedRoutes";
import { useAuth } from "@/app/context/AuthContext";


const AdminLayOut = ({ children }: any) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const { setUser, setAuthenticated } = useAuth();
    const { user } = useAuth();
    const handleLogout = () => {
        Cookies.remove("authToken");
        localStorage.removeItem("schedulerUserInfo");
        // setUser("");
        setAuthenticated(false);
        router.push("/");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <ProtectedRoutes>
            <div className="flex h-screen bg-gray-50">
                {/* Overlay for mobile when sidebar is open */}
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onClick={toggleSidebar}
                />

                {/* Sidebar */}
                <div className={`bg-white border-r border-gray-200 transition-all duration-300 w-64 fixed md:static z-30 h-full ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="font-bold text-xl text-black flex items-center">
                            Role-Based Management
                        </div>
                        <button onClick={toggleSidebar} className="p-1 rounded-md text-black hover:bg-gray-100 md:hidden">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Sidebar Navigation */}
                    <nav className="p-2">


                        {(user.role === "Manager") && <NavItem href="/team" icon={<User size={18} />} text="My team " />}
                                                {(user.role === "Manager") && <NavItem href="/order" icon={<User size={18} />} text="order by team " />}

                        {user.role === "Admin" && <NavItem href="/team" icon={<User size={18} />} text="Add Team Member" />}
                        {user.role === "ADMIN" && <NavItem href="/membership" icon={<Plus size={18} />} text="Add Membership" />}
                        {user.role === "Employee" && <NavItem href="/product" icon={<Package size={18} />} text="product" />}
                        {user.role === "Employee" && <NavItem href="/order" icon={<ShoppingCart size={18} />} text="order" />}

                        {(user.role === "ADMIN" || user.role === "USER") && (
                            <NavItem href="/upload-data" icon={<Upload size={18} />} text="Upload Data" />
                        )}
                        {(user.role === "Admin" || user.role === "Manager") && (
                            <NavItem href="/product" icon={<Upload size={18} />} text="Add Product" />
                        )}

                    </nav>
                    <button
                        onClick={handleLogout}
                        className="fixed bottom-4 left-1/2 transform cursor-pointer -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all"
                    >
                        Logout
                    </button>

                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white shadow-sm h-16 flex items-center justify-center">
                        <h1 className="text-black font-semibold text-xl md:text-2xl">{user.role == "Admin" ? "Admin Dashboard" : user.role == "Manager " ? "Manager Dashboard" : "Employee Dashboard"}</h1>
                    </header>


                    {/* Page Content */}
                    <main className="flex-1 overflow-auto ">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoutes>
    );
};

// Updated NavItem Component with Routing
const NavItem = ({ href, icon, text }: { href: string; icon: JSX.Element; text: string }) => {
    const pathname = usePathname(); // Get the current route path

    return (
        <Link href={href} className={`flex items-center px-3 py-3 rounded-md mb-1 cursor-pointer transition ${pathname === href ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
            <span className="mr-3 text-gray-500">{icon}</span>
            <span className="text-black">{text}</span>
        </Link>
    );
};

export default AdminLayOut;
