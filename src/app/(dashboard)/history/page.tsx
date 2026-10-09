"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiClock, FiBookOpen } from "react-icons/fi";
import toast from "react-hot-toast";

interface HistoryEntry {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  last_read_at: string;
  last_page: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data.history ?? data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to fetch reading history"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Reading History</h1>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reading History</h1>

      {history.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <FiClock className="h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            No reading history
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Books you read will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Read
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Page
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {history.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    <Link
                      href={`/books/${entry.book.id}`}
                      className="hover:text-primary-600 hover:underline"
                    >
                      {entry.book.title}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {entry.book.author}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(entry.last_read_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {entry.last_page > 0 ? `Page ${entry.last_page}` : "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Link
                      href={`/books/${entry.book.id}`}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800"
                    >
                      <FiBookOpen className="h-4 w-4" />
                      Continue
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
