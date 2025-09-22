"use client";
import { useState } from "react";
import {
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import NotFound from "../not-found";
import api from "@/utils/axios";
import { useAlert } from "@/components/Alert";
import { clearUser } from "@/redux/private/userSlice";
import { useSelector, useDispatch } from "react-redux";
import UpdateProfile from "@/components/profile/UpdateProfile";
import OrdersPage from "@/components/profile/OrderDetails";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("details");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const { showAlert, AlertComponent } = useAlert();
  const dispatch = useDispatch();

  if (!user) return <NotFound />;

  const handleSignout = async () => {
    if (confirm("Are you sure to logout?")) {
      try {
        await api.post("/auth/signout");
        dispatch(clearUser());
      } catch (err: any) {
        const errorMessage = err?.response?.data?.error || "Invalid credentials";
        showAlert(errorMessage, "error");
      }
    }
  };

  const tabs = [
    { key: "details", label: "Personal Info", icon: <FaUser /> },
    { key: "orders", label: "Orders", icon: <FaShoppingBag /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return <UpdateProfile />;
      case "orders":
        return <OrdersPage />;
      case "cart":
        return <div>Cart</div>;
      case "password":
        return <div>Update</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-primary pt-20">
      <AlertComponent/>
      
      {/* Mobile menu toggle button */}
      <button
        className="md:hidden fixed bottom-5 right-5 z-50 p-3 btn-primary rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-20 left-0 w-64 p-6 flex flex-col transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 bg-secondary" : "-translate-x-full"
        } h-[calc(100vh-5rem)]`}
      >
        <div>
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-secondary text-primary flex items-center justify-center text-3xl font-bold mx-auto">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-primary">{user.name}</h2>
            <p className="text-sm text-secondary capitalize">{user.role}</p>
          </div>
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === tab.key
                    ? "btn-primary shadow-md"
                    : "btn-secondary"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout button pinned bottom */}
        <button
          className="w-full mt-2 px-4 py-3 bg-accent hover:bg-accent-hover active:bg-accent-active rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer text-white"
          onClick={handleSignout}
        >
          <FaTimes />
          Logout
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-secondary opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
            {tabs.find((tab) => tab.key === activeTab)?.label}
          </h1>
          <p className="text-secondary">
            Manage your account settings
          </p>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}