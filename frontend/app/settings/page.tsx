"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { getUserProfile } from "@/contexts/AuthDetails";
import LogoutButton from "@/components/LogoutButton";
import { showConfirm } from "@/components/ConfirmModal";
import { showToast } from "@/components/Toast";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  hasPassword?: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [avatarModal, setAvatarModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingPassword, setSettingPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setNewName(data.name);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ================= UPDATE NAME =================
  const handleUpdateName = async () => {
    if (!newName.trim()) return;

    try {
      setSavingName(true);

      const res = await API.patch("/auth/update-profile", {
        name: newName,
      });
      showToast("Username updated!", "success");

      setUser(res.data);
      setEditMode(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingName(false);
    }
  };

  // ================= HANDLE IMAGE SELECT =================
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= SAVE AVATAR =================
  const handleSaveAvatar = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("avatar", selectedImage);

    try {
      setUploadingAvatar(true);

      const res = await API.put("/auth/update-avatar", formData);
      showToast(`${res.data.message}`, "success");
      setUser((prev) => (prev ? { ...prev, avatar: res.data.avatar } : prev));

      setAvatarModal(false);
      setPreview(null);
      setSelectedImage(null);
    } catch (err: any) {
      showToast(
        `${err?.response?.data?.message || "Error in Upload."}`,
        "error",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ================= SET PASSWORD =================
  const handleSetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    try {
      setSettingPassword(true);

      const res = await API.post("/auth/set-password", {
        password: newPassword,
      });
      showToast(`${res.data.message}`, "success");

      setUser((prev) => (prev ? { ...prev, hasPassword: true } : prev));

      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(
        `${err?.response?.data?.message || "Error in Uploading Password."}`,
        "error",
      );
    } finally {
      setSettingPassword(false);
    }
  };
  // ================= LOGOUT =================

  // ================= DELETE ACCOUNT =================
  const handleDeleteAccount = async () => {
    const ok = await showConfirm(
      "Are you sure you want to logout from your account?",
      "danger",
    );

    if (!ok) return;

    try {
      const res = await API.delete("/auth/delete-account");
      showToast(`${res.data.message}`, "success");
      window.location.href = "/";
    } catch (err: any) {
      showToast(
        `${err?.response?.data?.message || "Error in Deleting Account."}`,
        "error",
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-800">
            Account Settings
          </h1>

          {loading ? (
            <div className="animate-pulse space-y-8">
              <div className="w-24 h-24 rounded-full bg-gray-200" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          ) : (
            <>
              {/* ================= AVATAR ================= */}
              <div className="flex flex-col items-center mb-12">
                <div
                  onClick={() => setAvatarModal(true)}
                  className="relative group cursor-pointer"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg transition hover:scale-105">
                    {user?.avatar ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${user.avatar}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition">
                    Edit
                  </div>
                </div>

                <p className="mt-4 text-gray-500 text-sm">
                  Click image to change avatar
                </p>
              </div>

              {/* ================= NAME ================= */}
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Profile Name
                </h2>

                {editMode ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <button
                      onClick={handleUpdateName}
                      disabled={savingName}
                      className="px-5 py-2 bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition text-white rounded-xl flex items-center justify-center gap-2"
                    >
                      {savingName && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">{user?.name}</p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* ================= EMAIL ================= */}
              <div className="mt-10">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  Email
                </h2>
                <p className="text-gray-600 break-all">{user?.email}</p>
              </div>

              {/* ================= PASSWORD ================= */}
              {!user?.hasPassword && (
                <div className="mt-10">
                  <h2 className="text-lg font-semibold mb-4 text-gray-700">
                    Create Password
                  </h2>

                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />

                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    />

                    <button
                      onClick={handleSetPassword}
                      // disabled={settingPassword}
                      className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      {settingPassword && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      Set Password
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    After setting a password, you can log in using email and
                    password.
                  </p>
                </div>
              )}
              {/* ================= ACCOUNT ACTIONS ================= */}
              <div className="mt-14 border-t pt-8">
                <h2 className="text-lg font-semibold mb-6 text-gray-700">
                  Account Actions
                </h2>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Logout Button */}
                  <LogoutButton />

                  {/* Delete Account Button */}
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete Account
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Deleting your account will permanently remove all your data.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= AVATAR MODAL ================= */}
      {avatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Update Avatar
            </h3>

            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : user?.avatar ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_API}${user.avatar}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <label className="block text-center mb-4 cursor-pointer text-blue-600 font-medium">
              Choose New Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>

            <div className="flex gap-4">
              <button
                onClick={() => setAvatarModal(false)}
                className="w-full py-2 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveAvatar}
                disabled={uploadingAvatar}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition text-white flex items-center justify-center gap-2"
              >
                {uploadingAvatar && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
