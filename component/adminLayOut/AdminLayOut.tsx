"use client";
import React, { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    User,
    Upload,
    Plus,
    ShoppingCart,
    Package,
    X,
    Menu,
} from "lucide-react";
import Cookies from "js-cookie";
import ProtectedRoutes from "../ProtectedRoutes";
import { useAuth } from "@/app/context/AuthContext";

const AdminLayOut = ({ children }: any) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const { setAuthenticated } = useAuth();
    const { user } = useAuth();

    const handleLogout = () => {
        Cookies.remove("authToken");
        localStorage.removeItem("schedulerUserInfo");
        setAuthenticated(false);
        router.push("/");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Prevent body scroll on mobile when sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [sidebarOpen]);

    return (
        <ProtectedRoutes>
            <div className="flex h-screen bg-gray-50 relative">
                {/* Mobile overlay */}
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={toggleSidebar}
                />

                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 transition-all duration-300 fixed md:static z-30 h-full
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            w-3/4 sm:w-64`}
                >
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="font-bold text-xl text-black flex items-center">
                            <span className="text-orange-500 mr-2"></span> Role Base Mangement
                        </div>
                        <button onClick={toggleSidebar} className="p-1 rounded-md text-black hover:bg-gray-100 md:hidden">
                            <X size={20} />
                        </button>
                    </div>
                    {/* Sidebar Navigation */}
                    <nav className="p-2 space-y-1">
                        {user.role === "Manager" && (
                            <>
                                <NavItem href="/team" icon={<User size={18} />} text="My team" />
                                <NavItem href="/order" icon={<User size={18} />} text="Order by team" />
                            </>
                        )}

                        {user.role === "Admin" && (
                            <>
                                <NavItem href="/team" icon={<User size={18} />} text="Add Team Member" />
                                <NavItem href="/membership" icon={<Plus size={18} />} text="Add Membership" />
                                <NavItem href="/product" icon={<Upload size={18} />} text="Add Product" />
                                <NavItem href="/order" icon={<ShoppingCart size={18} />} text="All Orders" />
                            </>
                        )}

                        {user.role === "Employee" && (
                            <>
                                <NavItem href="/product" icon={<Package size={18} />} text="Product" />
                                <NavItem href="/order" icon={<ShoppingCart size={18} />} text="Order" />
                            </>
                        )}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all"
                    >
                        Logout
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4">
                        
                        <button onClick={toggleSidebar} className="p-2 text-black rounded-md hover:bg-gray-100 md:hidden">
                                <Menu size={24} />
                            </button>
                        <h1 className="text-black font-semibold text-xl md:text-2xl">
                            {user.role === "Admin"
                                ? "Admin Dashboard"
                                : user.role === "Manager"
                                    ? "Manager Dashboard"
                                    : "Employee Dashboard"}
                        </h1>
                        <div></div> {/* Spacer for alignment */}
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto bg-gray-50 p-4">{children}</main>
                </div>
            </div>
        </ProtectedRoutes>
    );
};

const NavItem = ({
    href,
    icon,
    text,
}: {
    href: string;
    icon: JSX.Element;
    text: string;
}) => {
    const pathname = usePathname();
    return (
        <Link
            href={href}
            className={`flex items-center px-3 py-3 rounded-md cursor-pointer transition ${pathname === href
                    ? "bg-gray-100 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
        >
            <span className="mr-3 text-gray-500">{icon}</span>
            <span className="text-black">{text}</span>
        </Link>
    );
};

export default AdminLayOut;
