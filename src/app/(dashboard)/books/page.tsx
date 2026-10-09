"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import BookCard from "@/components/BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image?: string;
  category?: { name: string } | string;
  views: number;
  downloads: number;
}

interface Category {
  id: string;
  name: string;
}

interface BooksResponse {
  books: Book[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        sort,
        ...(search && { search }),
        ...(category && { category }),
      });
      const res = await fetch(`/api/books?${params}`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data: BooksResponse = await res.json();
      setBooks(data.books);
      setTotalPages(data.pagination?.pages ?? 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, category]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategories(data.categories ?? data))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to fetch categories")
      );
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Browse Books</h1>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="most_viewed">Most Viewed</option>
            <option value="most_downloaded">Most Downloaded</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No books found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
