"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  department?: string;
  matric_no?: string;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchStudents = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users?role=student&page=${p}&limit=${PAGE_SIZE}`
      );
      const data = await res.json();
      setStudents(data.users || data || []);
      setTotal(data.total || data.length || 0);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <p className="text-gray-500 text-sm mt-1">
          View registered students
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FiUsers className="mx-auto text-4xl mb-3 text-gray-300" />
            <p>No students found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Matric No.</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{s.email}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {s.department || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {s.matric_no || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(s.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}-
                {Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  <FiChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
