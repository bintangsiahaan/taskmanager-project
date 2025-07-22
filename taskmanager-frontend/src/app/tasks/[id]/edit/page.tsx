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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // loader

  // Format deadline string ke datetime-local input (YYYY-MM-DDTHH:MM)
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

      console.log('Task fetched:', task); // debug log

      // Gunakan field sesuai respons backend
      setTitle(task.Title || '');
      setDescription(task.Description || '');
      setStatus(task.Status || 'Todo');
      setDeadline(formatDatetime(task.Deadline)); // datetime
      setAssigneeID(task.AssigneeID?.toString() || '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false); // ✅ pastikan loading selesai
    }
  };

  if (id) fetchTask();
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <p>Loading task...</p>
    </div>
  );
}


  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <input
          type="number"
          placeholder="Assignee ID"
          className="w-full border p-2 rounded"
          value={assigneeID}
          onChange={(e) => setAssigneeID(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
