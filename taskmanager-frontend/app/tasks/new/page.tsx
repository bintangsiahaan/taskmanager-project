'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [deadline, setDeadline] = useState('');
  const [assigneeID, setAssigneeID] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const res = await fetch('http://localhost:8080/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to fetch users');
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload = {
      title,
      description,
      status,
      deadline: deadline ? deadline + ':00Z' : null,
      assignee_id: assigneeID ? Number(assigneeID) : undefined,
    };

    console.log('Payload to send:', payload);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
    <div className="min-h-screen bg-gradient-to-br from-[#E186B4] to-[#BDD8FE] flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-black text-white py-2 rounded hover:opacity-90"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
