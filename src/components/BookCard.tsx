"use client";

import Link from "next/link";
import { FiEye, FiDownload, FiBookmark } from "react-icons/fi";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    cover_image?: string;
    category?: { name: string } | string;
    views: number;
    downloads: number;
  };
  onBookmark?: (bookId: string) => void;
}

export default function BookCard({ book, onBookmark }: BookCardProps) {
  const categoryName =
    typeof book.category === "object" && book.category !== null
      ? book.category.name
      : typeof book.category === "string"
      ? book.category
      : "Uncategorized";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/books/${book.id}`}>
        <div className="relative aspect-[3/4] bg-gray-100">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-300">
              <FiBookmark size={48} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 truncate">{book.author}</p>
        <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded font-medium">
          {categoryName}
        </span>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FiEye size={14} /> {book.views}
            </span>
            <span className="flex items-center gap-1">
              <FiDownload size={14} /> {book.downloads}
            </span>
          </div>

          {onBookmark && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmark(book.id);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              aria-label="Bookmark"
            >
              <FiBookmark size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
