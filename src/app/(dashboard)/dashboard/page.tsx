"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiBook, FiUsers, FiGrid, FiDownload } from "react-icons/fi";
import BookCard from "@/components/BookCard";

interface Stats {
  totalBooks: number;
  totalUsers: number;
  totalCategories: number;
  totalDownloads: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image?: string;
  category?: { name: string };
  views: number;
  downloads: number;
}

const statConfig = [
  { key: "totalBooks" as const, label: "Total Books", icon: <FiBook size={24} />, bg: "bg-primary-50", text: "text-primary-600" },
  { key: "totalUsers" as const, label: "Total Users", icon: <FiUsers size={24} />, bg: "bg-green-50", text: "text-green-600" },
  { key: "totalCategories" as const, label: "Categories", icon: <FiGrid size={24} />, bg: "bg-purple-50", text: "text-purple-600" },
  { key: "totalDownloads" as const, label: "Downloads", icon: <FiDownload size={24} />, bg: "bg-orange-50", text: "text-orange-600" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = (session?.user as any)?.role || "student";
  const userName = session?.user?.name || "User";
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  useEffect(() => {
    async function loadData() {
      try {
        if (isAdmin) {
          const res = await fetch("/api/stats");
          if (res.ok) {
            setStats(await res.json());
          }
        }
        const booksRes = await fetch("/api/books?limit=4&sort=created_at");
        if (booksRes.ok) {
          const data = await booksRes.json();
          setRecentBooks(data.books || data || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? "Admin Dashboard" : `Welcome back, ${userName}`}
        </h1>
        <p className="text-gray-500 mt-1">
          {isAdmin ? "Overview of your library" : "Continue where you left off"}
        </p>
      </div>

      {/* Admin stat cards */}
      {isAdmin && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statConfig.map((s) => (
            <div key={s.key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${s.bg} ${s.text}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats[s.key]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student quick links */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Browse Books", href: "/books", icon: <FiBook size={20} /> },
            { label: "My Bookmarks", href: "/bookmarks", icon: <FiGrid size={20} /> },
            { label: "Reading History", href: "/history", icon: <FiDownload size={20} /> },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <span className="text-primary-600">{link.icon}</span>
              <span className="font-medium text-gray-900">{link.label}</span>
            </a>
          ))}
        </div>
      )}

      {/* Recent books */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Books</h2>
        {recentBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No books available yet.</p>
        )}
      </div>
    </div>
  );
}
