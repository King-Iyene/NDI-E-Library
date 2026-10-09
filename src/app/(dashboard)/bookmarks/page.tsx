"use client";

import { useState, useEffect } from "react";
import { FiBookmark } from "react-icons/fi";
import toast from "react-hot-toast";
import BookCard from "@/components/BookCard";

interface Bookmark {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover_image?: string;
    category?: { name: string } | string;
    views: number;
    downloads: number;
  };
  created_at: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch("/api/bookmarks");
        if (!res.ok) throw new Error("Failed to fetch bookmarks");
        const data = await res.json();
        setBookmarks(data.bookmarks ?? data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to fetch bookmarks"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <FiBookmark className="h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            No bookmarks yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Browse the catalog and bookmark books you want to read later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookmarks.map((bookmark) => (
            <BookCard key={bookmark.id} book={bookmark.book} />
          ))}
        </div>
      )}
    </div>
  );
}
