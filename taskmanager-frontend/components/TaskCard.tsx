'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Task {
  ID: number;
  Title: string;
  Description: string;
  Status: string;
  Deadline: string;
  AssigneeID: number;
  Assignee?: {
    ID: number;
    Name: string;
    Email: string;
  };
}

export default function TaskCard({ task }: { task: Task }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/tasks/${task.ID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete task');
      setShowConfirmModal(false);
      window.location.reload(); // Atau panggil refetch
    } catch (err) {
      alert('Error deleting task');
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <div className="relative border border-black text-black p-4 rounded shadow">
        {/* Menu Icon */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-xl font-bold hover:text-gray-600"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-black rounded shadow z-10">
              <button
                onClick={() => router.push(`/tasks/${task.ID}`)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                View
              </button>
              <button
                onClick={() => router.push(`/tasks/${task.ID}/edit`)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Task Info */}
        <h2 className="text-lg font-semibold">{task.Title}</h2>
        <p className="text-sm text-gray-600">{task.Description}</p>
        <p className="text-sm mt-1">
          Status: <strong>{task.Status}</strong>
        </p>
        <p className="text-sm">Deadline: {new Date(task.Deadline).toLocaleString()}</p>
        <p className="text-sm">Assigned to: {task.Assignee?.Name || 'Unassigned'}</p>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
  <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-300">
      <h2 className="text-xl font-bold mb-3">Confirm Delete</h2>
      <p className="mb-5 text-gray-700">
       Are you sure you want to delete <strong>&quot;{task.Title}&quot;</strong>?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowConfirmModal(false)}
          className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
