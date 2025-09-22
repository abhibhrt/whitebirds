"use client";
import { useState } from "react";
import api from "@/utils/axios";
import { useAlert } from "@/components/Alert";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/redux/private/userSlice";

export default function UpdateProfile() {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobNo: user?.mobNo || "",
    address: {
      state: user?.address?.state || "",
      city: user?.address?.city || "",
      pincode: user?.address?.pincode || "",
      addressLine: user?.address?.addressLine || "",
    },
  });
  const { showAlert, AlertComponent } = useAlert();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field?: string) => {
    const { name, value } = e.target;
    if (field === "address") {
      setFormData((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await api.put("/personal/update", {
        name: formData.name,
        mobNo: formData.mobNo,
        address: formData.address,
      });
      dispatch(updateUser(response.data.user));
      showAlert(response.data.message, "success");
      setIsEditing(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || "Failed to update";
      showAlert(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary rounded-lg shadow p-6 animate-fadeIn">
      <AlertComponent />
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Profile Information
      </h2>

      {isEditing ? (
        <div className="grid grid-cols-1 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              className="w-full p-3 border rounded-md bg-secondary text-primary"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobNo"
              value={formData.mobNo}
              onChange={(e) => handleChange(e)}
              className="w-full p-3 border rounded-md bg-secondary text-primary"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="addressLine"
              value={formData.address.addressLine}
              onChange={(e) => handleChange(e, "address")}
              className="w-full p-3 border rounded-md bg-secondary text-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={(e) => handleChange(e, "address")}
                className="w-full p-3 border rounded-md bg-secondary text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={(e) => handleChange(e, "address")}
                className="w-full p-3 border rounded-md bg-secondary text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.address.pincode}
                onChange={(e) => handleChange(e, "address")}
                className="w-full p-3 border rounded-md bg-secondary text-primary"
              />
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md transition cursor-pointer text-white ${
                isLoading ? "bg-primary/50 cursor-not-allowed" : "btn-primary"
              }`}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Name
              </label>
              <div className="p-3 rounded-md bg-secondary text-primary">
                {user?.name || "Not provided"}
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Mobile Number
              </label>
              <div className="p-3 rounded-md bg-secondary text-primary">
                {user?.mobNo || "Not provided"}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Street Address
              </label>
              <div className="p-3 rounded-md bg-secondary text-primary">
                {user?.address?.addressLine || "Not provided"}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  City
                </label>
                <div className="p-3 rounded-md bg-secondary text-primary">
                  {user?.address?.city || "Not provided"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  State
                </label>
                <div className="p-3 rounded-md bg-secondary text-primary">
                  {user?.address?.state || "Not provided"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  ZIP Code
                </label>
                <div className="p-3 rounded-md bg-secondary text-primary">
                  {user?.address?.pincode || "Not provided"}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-accent mt-6"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}