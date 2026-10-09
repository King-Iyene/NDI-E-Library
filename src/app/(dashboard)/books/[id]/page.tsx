"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiArrowLeft,
  FiBookOpen,
  FiDownload,
  FiBookmark,
  FiEye,
  FiCalendar,
  FiGlobe,
  FiHash,
  FiFileText,
  FiUser,
  FiLayers,
  FiPrinter,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  category: string;
  publisher: string;
  published_year: number;
  language: string;
  isbn: string;
  pages: number;
  viewCount: number;
  downloadCount: number;
  file_url: string;
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) throw new Error("Failed to fetch book");
        const data = await res.json();
        setBook(data.book ?? data);
        setBookmarked(data.isBookmarked ?? false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to fetch book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();

    // Record view in history
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: id }),
    }).catch(() => {});
  }, [id]);

  const toggleBookmark = async () => {
    if (!book) return;
    setBookmarkLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
      });
      if (!res.ok) throw new Error("Failed to update bookmark");
      setBookmarked((prev) => !prev);
      toast.success(bookmarked ? "Bookmark removed" : "Book bookmarked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="h-96 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">Book not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const details = [
    { icon: FiLayers, label: "Category", value: book.category },
    { icon: FiPrinter, label: "Publisher", value: book.publisher },
    { icon: FiCalendar, label: "Published", value: String(book.published_year) },
    { icon: FiGlobe, label: "Language", value: book.language },
    { icon: FiHash, label: "ISBN", value: book.isbn },
    { icon: FiFileText, label: "Pages", value: String(book.pages) },
    { icon: FiEye, label: "Views", value: book.viewCount.toLocaleString() },
    { icon: FiDownload, label: "Downloads", value: book.downloadCount.toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Cover Image */}
        <div className="shrink-0">
          <div className="relative h-96 w-64 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={book.cover_image}
              alt={book.title}
              fill
              className="object-cover"
              sizes="256px"
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
            <p className="mt-1 flex items-center gap-2 text-lg text-gray-600">
              <FiUser className="h-5 w-5" />
              {book.author}
            </p>
          </div>

          <p className="leading-relaxed text-gray-700">{book.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={book.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
            >
              <FiBookOpen className="h-4 w-4" />
              Read Online
            </a>
            <a
              href={book.file_url}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiDownload className="h-4 w-4" />
              Download
            </a>
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium ${
                bookmarked
                  ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } disabled:opacity-50`}
            >
              <FiBookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
