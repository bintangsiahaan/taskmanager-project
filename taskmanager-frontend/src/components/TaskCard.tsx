'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Task {
  ID: number;
  Title: string;
  Description: string;
  Status: string;
  Deadline: string;
  AssigneeID: number;
}

export default function TaskCard({ task }: { task: Task }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/tasks/${task.ID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete task');
      window.location.reload(); // Atau panggil refetch dari parent
    } catch (err) {
      alert('Error deleting task');
    }
  };

  return (
    <div className="relative border p-4 rounded shadow">
      {/* Menu Icon */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-xl font-bold hover:text-gray-600"
        >
          ⋮
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
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
              onClick={handleDelete}
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
      <p className="text-sm">Assignee ID: {task.AssigneeID}</p>
    </div>
  );
}
