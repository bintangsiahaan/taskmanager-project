'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [deadline, setDeadline] = useState('');
  const [assigneeID, setAssigneeID] = useState('');
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const formatDatetime = (value?: string) => {
    if (!value || value.length < 10) return '';
    const fullValue = value.length === 10 ? `${value}T00:00:00Z` : value;
    const date = new Date(fullValue);
    if (isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const adjusted = new Date(date.getTime() - offset * 60000);
    return adjusted.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch task');
        const task = await res.json();

        setTitle(task.Title || '');
        setDescription(task.Description || '');
        setStatus(task.Status || 'Todo');
        setDeadline(formatDatetime(task.Deadline));
        setAssigneeID(task.AssigneeID?.toString() || '');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    if (id) {
      fetchTask();
      fetchUsers();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
          deadline: deadline ? deadline + ':00Z' : null,
          assignee_id: Number(assigneeID),
        }),
      });

      if (!res.ok) throw new Error('Failed to update task');
      router.push('/tasks');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E186B4] to-[#BDD8FE] flex items-center justify-center text-black">
        <p>Loading task...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E186B4] to-[#BDD8FE] flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border border-black p-2 rounded placeholder-gray-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border border-black p-2 rounded placeholder-gray-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <select
            className="w-full border border-black p-2 rounded text-black"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <input
            type="datetime-local"
            className="w-full border border-black p-2 rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <select
            className="w-full border border-black p-2 rounded text-black"
            value={assigneeID}
            onChange={(e) => setAssigneeID(e.target.value)}
            required
          >
            <option value="">Select Assignee</option>
            {users.map((user) => (
              <option key={user.id} value={String(user.id)}>
                {user.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
}
