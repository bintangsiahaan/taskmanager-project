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

  const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'done':
      return {
        badge: 'bg-green-100 text-green-700',
        dot: 'bg-green-500',
      };
    case 'in progress':
      return {
        badge: 'bg-blue-100 text-blue-700',
        dot: 'bg-blue-500',
      };
    case 'todo':
      return {
        badge: 'bg-yellow-100 text-yellow-700',
        dot: 'bg-yellow-500',
      };
    case 'overdue':
      return {
        badge: 'bg-red-100 text-red-700',
        dot: 'bg-red-500',
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-700',
        dot: 'bg-gray-500',
      };
  }
};
const { badge, dot } = getStatusStyle(task.Status);



  return (
  <>
    {/* Gradient Border Wrapper */}
    <div
      className="p-[2px] rounded-xl"
      style={{
        background: 'linear-gradient(to right, #E186B4, #BDD8FE)',
      }}
    >
      {/* Inner Card */}
      <div className="relative bg-white text-black p-4 rounded-xl shadow">
        {/* Dropdown Menu */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="text-xl font-bold hover:text-gray-600"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow z-10">
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
        <div className="text-sm mt-2">
  <div className="text-sm mt-2">
  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs ${badge}`}>
    <span className={`w-2 h-2 rounded-full ${dot}`}></span>
    {task.Status.toUpperCase()}
  </span>
</div>

</div>
        <p className="text-sm flex items-center gap-2 mt-1">
  <i className="fas fa-calendar-alt text-sm text-black-500"></i>
  {new Date(task.Deadline).toLocaleString()}
</p>

<p className="text-sm flex items-center gap-2">
  <i className="fas fa-user text-sm text-black-500"></i>
  {task.Assignee?.Name || 'Unassigned'}
</p>

      </div>
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
