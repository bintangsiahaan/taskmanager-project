'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [deadline, setDeadline] = useState('');
  const [assigneeID, setAssigneeID] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8080/tasks/', {
      method: 'POST',
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

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create task');
    }

    router.push('/tasks');
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Unexpected error');
    }
  }
};


  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
  required
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
