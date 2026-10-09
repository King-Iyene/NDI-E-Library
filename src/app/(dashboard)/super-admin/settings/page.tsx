"use client";

import { useState, useEffect } from "react";
import { FiBook, FiUsers, FiHardDrive, FiSettings } from "react-icons/fi";
import toast from "react-hot-toast";

interface SystemInfo {
  totalBooks: number;
  totalUsers: number;
  storageUsed: string;
}

export default function SuperAdminSettingsPage() {
  const [info, setInfo] = useState<SystemInfo>({
    totalBooks: 0,
    totalUsers: 0,
    storageUsed: "0 MB",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const [booksRes, usersRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/users"),
        ]);
        const booksData = await booksRes.json();
        const usersData = await usersRes.json();

        const books = booksData.books || booksData || [];
        const users = usersData.users || usersData || [];

        setInfo({
          totalBooks: Array.isArray(books) ? books.length : booksData.total || 0,
          totalUsers: Array.isArray(users) ? users.length : usersData.total || 0,
          storageUsed: booksData.storageUsed || "N/A",
        });
      } catch {
        toast.error("Failed to load system info");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const stats = [
    {
      label: "Total Books",
      value: info.totalBooks,
      icon: FiBook,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Total Users",
      value: info.totalUsers,
      icon: FiUsers,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Storage Used",
      value: info.storageUsed,
      icon: FiHardDrive,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          System overview and configuration
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiSettings className="text-gray-400" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">
                Configuration
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-700">Site Name</p>
                  <p className="text-sm text-gray-500">
                    The name displayed across the platform
                  </p>
                </div>
                <span className="text-sm text-gray-400 italic">
                  Coming soon
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-700">Max Upload Size</p>
                  <p className="text-sm text-gray-500">
                    Maximum file size for uploads
                  </p>
                </div>
                <span className="text-sm text-gray-400 italic">
                  Coming soon
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-700">
                    Maintenance Mode
                  </p>
                  <p className="text-sm text-gray-500">
                    Temporarily disable public access
                  </p>
                </div>
                <span className="text-sm text-gray-400 italic">
                  Coming soon
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-700">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Configure email notification settings
                  </p>
                </div>
                <span className="text-sm text-gray-400 italic">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
